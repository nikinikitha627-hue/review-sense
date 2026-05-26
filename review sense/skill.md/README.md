# 🚀 ReviewSense — AI-Powered Product Review Analyzer

> **Turn hundreds of customer reviews into actionable insights instantly.**  
> Smart sentiment analysis, pros/cons extraction, red flag detection, and intelligent recommendations.

---

## Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 18 + Vite + TypeScript + TailwindCSS |
| Backend      | FastAPI (Python 3.11+)              |
| AI Engine    | OpenAI GPT-4o / GPT-4o-mini         |
| Database     | PostgreSQL (Prod) / SQLite (Dev)    |
| State        | Zustand + TanStack Query            |
| Charts       | Recharts + Framer Motion            |
| Infra        | Docker Compose + Nginx              |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/reviewsense.git
cd reviewsense

# 2. Copy environment variables
cp .env.example .env

# 3. Launch full stack
make docker-up

# or run in development mode
make dev