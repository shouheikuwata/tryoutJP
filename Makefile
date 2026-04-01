.PHONY: help install dev build start lint format \
       db-create db-migrate db-push db-seed db-studio db-reset \
       aggregate-daily aggregate-monthly aggregate-yearly aggregate-cumulative aggregate-all \
       docker-db docker-db-stop docker-db-clean \
       prisma-generate prisma-format \
       env-setup clean type-check

# ============================================================
# Help
# ============================================================
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

# ============================================================
# Setup
# ============================================================
install: ## Install all dependencies
	npm install --cache /tmp/npm-cache-beauty

env-setup: ## Copy .env.example to .env (won't overwrite existing)
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✓ .env created from .env.example"; \
		echo "  → Edit .env with your actual values"; \
	else \
		echo "✓ .env already exists"; \
	fi

setup: install env-setup prisma-generate ## Full initial setup (install + env + prisma generate)
	@echo "✓ Setup complete. Next: make docker-db && make db-migrate && make db-seed"

# ============================================================
# Development
# ============================================================
dev: ## Start Next.js dev server with Turbopack
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start

lint: ## Run ESLint
	npm run lint

format: ## Format code with Prettier
	npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"

type-check: ## Run TypeScript type check
	npx tsc --noEmit

# ============================================================
# Database - Docker
# ============================================================
docker-db: ## Start PostgreSQL in Docker
	docker run -d \
		--name beautyspot-db \
		-e POSTGRES_USER=beautyspot \
		-e POSTGRES_PASSWORD=beautyspot \
		-e POSTGRES_DB=beautyspot \
		-p 5432:5432 \
		-v beautyspot-pgdata:/var/lib/postgresql/data \
		postgres:16-alpine
	@echo "✓ PostgreSQL started on port 5432"
	@echo "  DATABASE_URL=postgresql://beautyspot:beautyspot@localhost:5432/beautyspot"

docker-db-stop: ## Stop PostgreSQL Docker container
	docker stop beautyspot-db && docker rm beautyspot-db
	@echo "✓ PostgreSQL container stopped and removed"

docker-db-clean: docker-db-stop ## Stop and remove PostgreSQL data volume
	docker volume rm beautyspot-pgdata
	@echo "✓ PostgreSQL data volume removed"

docker-db-logs: ## Show PostgreSQL container logs
	docker logs -f beautyspot-db

# ============================================================
# Database - Prisma
# ============================================================
prisma-generate: ## Generate Prisma client
	npx prisma generate

prisma-format: ## Format Prisma schema
	npx prisma format

db-create: docker-db ## Create local database (alias for docker-db)

db-migrate: ## Run Prisma migrations (dev)
	npx prisma migrate dev

db-migrate-deploy: ## Run Prisma migrations (production)
	npx prisma migrate deploy

db-push: ## Push schema directly (no migration file)
	npx prisma db push

db-seed: ## Seed database with sample data
	npx tsx prisma/seed.ts

db-studio: ## Open Prisma Studio (GUI)
	npx prisma studio

db-reset: ## Reset database (drop all + migrate + seed)
	npx prisma migrate reset --force

db-fresh: docker-db-clean docker-db ## Fresh database from scratch
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	$(MAKE) db-migrate
	$(MAKE) db-seed
	@echo "✓ Fresh database ready"

# ============================================================
# Aggregation Jobs
# ============================================================
aggregate-daily: ## Run daily aggregation
	npx tsx scripts/daily-aggregate.ts

aggregate-monthly: ## Run monthly rollup
	npx tsx scripts/monthly-rollup.ts

aggregate-yearly: ## Run yearly rollup
	npx tsx scripts/yearly-rollup.ts

aggregate-cumulative: ## Run cumulative rollup
	npx tsx scripts/cumulative-rollup.ts

aggregate-all: aggregate-daily aggregate-monthly aggregate-yearly aggregate-cumulative ## Run all aggregation jobs

# ============================================================
# Testing
# ============================================================
test: ## Run all tests
	npx vitest run

test-watch: ## Run tests in watch mode
	npx vitest

test-e2e: ## Run end-to-end tests
	npx playwright test

# ============================================================
# Deploy
# ============================================================
deploy-preview: ## Deploy to Vercel preview
	npx vercel

deploy-prod: ## Deploy to Vercel production
	npx vercel --prod

# ============================================================
# Utilities
# ============================================================
clean: ## Remove node_modules, .next, generated files
	rm -rf node_modules .next
	@echo "✓ Cleaned node_modules and .next"

logs: ## Tail application logs (development)
	tail -f .next/server/*.log 2>/dev/null || echo "No log files found. Start dev server first."

check-env: ## Verify required environment variables
	@echo "Checking required environment variables..."
	@test -n "$$DATABASE_URL" || (echo "❌ DATABASE_URL is not set" && exit 1)
	@test -n "$$NEXTAUTH_SECRET" || (echo "❌ NEXTAUTH_SECRET is not set" && exit 1)
	@test -n "$$FIELD_ENCRYPTION_KEY" || (echo "❌ FIELD_ENCRYPTION_KEY is not set" && exit 1)
	@test -n "$$PHONE_HASH_SECRET" || (echo "❌ PHONE_HASH_SECRET is not set" && exit 1)
	@echo "✓ All required environment variables are set"

generate-keys: ## Generate random keys for FIELD_ENCRYPTION_KEY and PHONE_HASH_SECRET
	@echo "FIELD_ENCRYPTION_KEY=$$(openssl rand -hex 32)"
	@echo "PHONE_HASH_SECRET=$$(openssl rand -hex 32)"
	@echo "NEXTAUTH_SECRET=$$(openssl rand -base64 32)"

# ============================================================
# Quick Start (all-in-one)
# ============================================================
quickstart: setup docker-db ## Quick start: install, setup env, start DB
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	$(MAKE) db-migrate
	$(MAKE) db-seed
	@echo ""
	@echo "============================================"
	@echo "✓ Beauty Spot is ready!"
	@echo "  Run 'make dev' to start the dev server"
	@echo "  Admin: admin@beautyspot.example / Password123!"
	@echo "  Facility: ginza@example.com / Password123!"
	@echo "============================================"
