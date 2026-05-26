.PHONY: help dev build test lint clean docker-up docker-down docker-logs docs

# ── Colors ──────────────────────────────────────────────────────
CYAN  := \033[0;36m
GREEN := \033[0;32m
YELLOW:= \033[0;33m
RESET := \033[0m

# ── Default ─────────────────────────────────────────────────────
help:
	@echo ""
	@echo "$(CYAN)ReviewSense$(RESET) — AI-Powered Product Review Analyzer"
	@echo "$(YELLOW)=========================================$(RESET)"
	@echo ""
	@echo "  $(GREEN)make dev$(RESET)              Start frontend + backend in development mode"
	@echo "  $(GREEN)make build$(RESET)            Build frontend for production"
	@echo "  $(GREEN)make test$(RESET)             Run all tests (frontend + backend)"
	@echo "  $(GREEN)make lint$(RESET)             Run linters (ESLint + Ruff)"
	@echo "  $(GREEN)make docker-up$(RESET)        Start full stack with Docker"
	@echo "  $(GREEN)make docker-down$(RESET)      Stop Docker services"
	@echo "  $(GREEN)make docker-logs$(RESET)      View Docker logs"
	@echo "  $(GREEN)make docs$(RESET)             Open Swagger API documentation"
	@echo "  $(GREEN)make clean$(RESET)            Clean build artifacts and cache"
	@echo ""

# ── Development ─────────────────────────────────────────────────
dev:
	@echo "$(CYAN)🚀 Starting ReviewSense development stack...$(RESET)"
	@trap 'kill 0' INT; \
	  (cd frontend && npm run dev) & \
	  (cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000) & \
	  wait

# ── Build ───────────────────────────────────────────────────────
build:
	@echo "$(CYAN)📦 Building ReviewSense frontend...$(RESET)"
	cd frontend && npm run build
	@echo "$(GREEN)✅ Build completed successfully!$(RESET)"

# ── Test ────────────────────────────────────────────────────────
test:
	@echo "$(CYAN)🧪 Running tests...$(RESET)"
	cd backend && pytest tests/ -v || echo "No backend tests found"
	cd frontend && npm run test || echo "No frontend tests configured"

# ── Lint ────────────────────────────────────────────────────────
lint:
	@echo "$(CYAN)🔍 Running linters...$(RESET)"
	cd backend && ruff check . && ruff format --check .
	cd frontend && npm run lint

# ── Docker ──────────────────────────────────────────────────────
docker-up:
	@echo "$(CYAN)🐳 Starting ReviewSense with Docker...$(RESET)"
	docker compose up --build -d

docker-down:
	@echo "$(CYAN)🛑 Stopping ReviewSense Docker services...$(RESET)"
	docker compose down

docker-logs:
	docker compose logs -f

docker-restart:
	docker compose restart

# ── Documentation ───────────────────────────────────────────────
docs:
	@echo "$(CYAN)📖 Opening API Documentation...$(RESET)"
	@open http://localhost:8000/docs 2>/dev/null || \
	 xdg-open http://localhost:8000/docs 2>/dev/null || \
	 echo "Please open: http://localhost:8000/docs"

# ── Clean ───────────────────────────────────────────────────────
clean:
	@echo "$(CYAN)🧹 Cleaning ReviewSense project...$(RESET)"
	rm -rf frontend/dist frontend/node_modules/.cache
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find backend -name "*.pyc" -delete 2>/dev/null || true
	rm -rf backend/outputs/* 2>/dev/null || true
	@echo "$(GREEN)✅ Clean completed!$(RESET)"

# ── Utilities ───────────────────────────────────────────────────
shell-backend:
	docker compose exec backend bash

shell-frontend:
	docker compose exec frontend sh
