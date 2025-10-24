# WARP.md
# Warp Workflows for UREP Backend Server
# --------------------------------------

name: UREP Backend Server
version: 1.0.0
author: thatzerroguy
tags: [nestjs, drizzle, postgres, urep]

---

# 🚀 Setup & Start

## Setup project
command: cp config/.env.example .env && pnpm install && pnpm run migrate
description: Complete project setup.

## Start dev
command: pnpm run start:dev
description: Start dev server with hot-reload.

## View API docs
command: open http://localhost:3000/api
description: Open Swagger docs.

---

# 🗃️ Database

## Run migrations
command: pnpm run migrate
description: Apply pending migrations.

## Generate migration
command: npx drizzle-kit generate
description: Generate migration from schema.

## DB shell
command: psql "$DATABASE_URL"
description: Open PostgreSQL shell.

## Backup DB
command: pg_dump "$DATABASE_URL" > backups/urep_$(date +%Y%m%d_%H%M%S).sql
description: Create database backup.

---

# 🧪 Testing

## Run tests
command: pnpm run test
description: Run all tests.

## Watch tests
command: pnpm run test:watch
description: Run tests in watch mode.

## Lint & fix
command: pnpm run lint --fix
description: Fix linting issues.

## Pre-commit
command: pnpm run lint --fix && pnpm run test
description: Lint and test before commit.

---

# 🧠 AI Generators

## Generate Module
ai_command: |
Generate NestJS module for UREP: {MODULE_NAME}
Include: module.ts, controller.ts, service.ts, dto folder
Use Drizzle ORM, @Roles decorator, JwtAuthGuard
Path: src/{module}/
description: Scaffold complete UREP module.

## Generate DTO
ai_command: |
Generate DTO for: {MODULE}/{ENTITY}
Use Zod validation, Swagger decorators
Path: src/{module}/dto/{action}-{entity}.dto.ts
description: Generate validated DTO.

## Generate Service
ai_command: |
Generate service for: {MODULE}
Use Drizzle ORM with CRUD methods
Add error handling, role checks
Path: src/{module}/{module}.service.ts
description: Generate service with CRUD.

## Generate Controller
ai_command: |
Generate controller for: {MODULE}
Include Swagger docs, @Roles guards
RESTful endpoints with proper DTOs
Path: src/{module}/{module}.controller.ts
description: Generate REST controller.

## Generate Schema
ai_command: |
Generate Drizzle schema for: {TABLE_NAME}
Include id, timestamps, relations
Path: database/schema/{table}.schema.ts
description: Generate DB schema.

## Generate Tests
ai_command: |
Generate Jest tests for: {FILE_PATH}
Mock dependencies, test all methods
Include auth/role test cases
description: Generate test suite.

## Add Swagger Docs
ai_command: |
Add Swagger decorators to: {CONTROLLER_PATH}
Include: @ApiTags, @ApiOperation, @ApiResponse, @ApiBearerAuth
Add request/response examples
Document all endpoints with proper status codes
description: Add comprehensive Swagger documentation.

## Generate Swagger DTO
ai_command: |
Add Swagger decorators to DTO: {DTO_PATH}
Use @ApiProperty with examples, descriptions
Add @ApiPropertyOptional for optional fields
Include validation constraints in descriptions
description: Document DTO with Swagger decorators.

---

# 🔧 Utils

## Kill port 3000
command: lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "✅ Port free"
description: Kill process on port 3000.

## Clear cache
command: rm -rf dist/ node_modules/.cache
description: Remove build cache.

## Fresh install
command: rm -rf node_modules pnpm-lock.yaml && pnpm install
description: Reinstall dependencies.

## Create module
command: mkdir -p src/$1/{dto,interfaces} && touch src/$1/$1.{module,controller,service}.ts
description: Create module structure.

---

# 📦 Git (Conventional Commits)

## feat commit
command: git add -A && git commit -m "feat: $1"
description: Commit new feature.

## fix commit
command: git add -A && git commit -m "fix: $1"
description: Commit bug fix.

## refactor commit
command: git add -A && git commit -m "refactor: $1"
description: Commit refactor.

## Feature branch
command: git checkout develop && git pull && git checkout -b feature/$1
description: Create feature branch from develop.

## Push branch
command: git push origin $(git branch --show-current)
description: Push current branch.