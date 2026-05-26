"""
ReviewSense Pipeline Engine
Core AI automation executor — modular, composable, and production-ready.
"""

import json
import logging
import os
from pathlib import Path
from typing import Any, Dict

from openai import AsyncOpenAI
from datetime import datetime

logger = logging.getLogger("reviewsense.engine")


class PipelineEngine:
    """
    Executes named pipelines for ReviewSense using OpenAI GPT models.
    Handles prompt loading, structured output, and result persistence.
    """

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY not set — AI pipelines will fail")

        self.client = AsyncOpenAI(api_key=api_key)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "8192"))
        self.temperature = float(os.getenv("OPENAI_TEMPERATURE", "0.3"))

        # Directories
        self.prompts_dir = Path(__file__).parent.parent / "prompts"
        self.outputs_dir = Path(os.getenv("PIPELINE_OUTPUT_DIR", "outputs"))
        self.outputs_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"ReviewSense Pipeline Engine initialized with model: {self.model}")

    async def run(
        self,
        pipeline: str,
        input_data: Dict[str, Any],
        options: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        """Execute a named pipeline and return structured output."""
        if options is None:
            options = {}

        logger.info(f"Running pipeline: {pipeline}")

        # Load system prompt
        system_prompt = self._load_prompt(pipeline)

        # Build user message
        user_message = self._build_message(pipeline, input_data, options)

        try:
            # Call OpenAI
            response = await self.client.chat.completions.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                response_format={"type": "json_object"},   # Enforce JSON output
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
            )

            raw = response.choices[0].message.content
            logger.debug(f"Raw response received ({len(raw)} chars)")

            # Parse and validate
            result = self._parse_output(pipeline, raw)

            # Save output
            self._save_output(pipeline, result)

            return result

        except Exception as e:
            logger.error(f"Pipeline '{pipeline}' failed: {str(e)}")
            return {
                "success": False,
                "pipeline": pipeline,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    def _load_prompt(self, pipeline: str) -> str:
        """Load prompt template from file or use fallback."""
        prompt_path = self.prompts_dir / f"{pipeline}.md"
        
        if prompt_path.exists():
            return prompt_path.read_text(encoding="utf-8").strip()
        
        # Fallback generic prompt
        return f"""You are ReviewSense, an expert product review analyst.
Analyze the given data and return ONLY valid JSON output.
Be precise, honest, and insightful."""

    def _build_message(self, pipeline: str, input_data: Dict, options: Dict) -> str:
        """Build the user message with input data."""
        if not input_data:
            return f"Execute the '{pipeline}' pipeline with default settings."

        return f"""Execute the '{pipeline}' pipeline with the following input:

```json
{json.dumps(input_data, indent=2)}
