"""
Antigravity CLI
Usage: python -m antigravity.run --pipeline <name> [--input <json>] [--feature "name"]
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path

# Allow running from repo root
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))


async def main():
    parser = argparse.ArgumentParser(
        prog="antigravity",
        description="Antigravity Pipeline Runner — AI automation CLI",
    )
    parser.add_argument("--pipeline", "-p", required=True, help="Pipeline name to run")
    parser.add_argument("--input", "-i", default="{}", help="JSON input string")
    parser.add_argument("--feature", "-f", default=None, help="Feature name (for scaffold)")
    parser.add_argument("--output", "-o", default=None, help="Output file path")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    import logging
    level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=level, format="%(levelname)s  %(name)s  %(message)s")

    # Build input dict
    try:
        input_data = json.loads(args.input)
    except json.JSONDecodeError as e:
        print(f"[ERROR] Invalid JSON input: {e}")
        sys.exit(1)

    if args.feature:
        input_data["feature"] = args.feature

    from antigravity.engine import PipelineEngine
    engine = PipelineEngine()

    print(f"🚀 Running pipeline: {args.pipeline}")
    result = await engine.run(args.pipeline, input_data, {})

    output = json.dumps(result, indent=2)

    if args.output:
        Path(args.output).write_text(output)
        print(f"✅ Output written to: {args.output}")
    else:
        print("\n── Output ────────────────────────────────")
        print(output)
        print("──────────────────────────────────────────")


if __name__ == "__main__":
    asyncio.run(main())
