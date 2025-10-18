# WARP.md
# Warp Workflows for UREP Backend Server
# --------------------------------------
# This file defines custom Warp Workflows for the UREP backend project.
# Use ⌘ + Enter (Mac) or Ctrl + Enter (Windows/Linux) in Warp to view and run workflows.

name: UREP Backend Server
description: Warp workflows and AI automations for the UREP backend (NestJS + Drizzle + PostgreSQL)
author: thatzerroguy
tags: [nestjs, drizzle, postgres, backend, api, ai]

---

# 🧱 Project Setup

## Install dependencies
command: pnpm install
description: Install all project dependencies using PNPM.

## Set up environment variables
command: cp .env.example .env
description: Copy example environment file to `.env` for local configuration.

## Run database migrations
command: pnpm run migrate
description: Apply pending Drizzle ORM migrations to the PostgreSQL database.

---

# ⚙️ Development

## Start development server
command: pnpm run start:dev
description: Start the NestJS development server with hot-reload.

## Generate new migration
command: npx drizzle-kit generate
description: Generate a new SQL migration file from schema changes.

## Apply database migrations
command: npx drizzle-kit push
description: Push new migrations to the PostgreSQL database.

## Format and lint code
command: pnpm run lint && pnpm run format
description: Format and lint all project files.

---

# 🧪 Testing

## Run all tests
command: pnpm run test
description: Run all Jest tests (unit and integration).

## Run end-to-end tests
command: pnpm run test:e2e
description: Run E2E tests for API endpoints.

## Watch tests during development
command: pnpm run test:watch
description: Run Jest in watch mode for active development.

---

# 🧰 Database

## Connect to PostgreSQL
command: psql $DATABASE_URL
description: Open a PostgreSQL shell connected via DATABASE_URL.

## Inspect database schema
command: npx drizzle-kit introspect
description: Generate Drizzle schema from the existing PostgreSQL database.

---

# 🧠 AI Workflows (Warp AI Assisted)

## 🧩 Generate NestJS DTO
ai_command: >
Generate a NestJS Data Transfer Object (DTO) TypeScript file for a module in the UREP backend.
Follow naming conventions and include class-validator decorators based on the given fields.
description: Use Warp AI to generate a NestJS DTO class automatically.

## ⚙️ Generate NestJS Service
ai_command: >
Create a NestJS service class with CRUD methods for a given entity (create, findAll, findOne, update, remove).
Ensure it uses Drizzle ORM and follows the UREP backend structure.
description: Auto-generate a standard NestJS service class with Drizzle ORM queries.

## 🧱 Generate NestJS Module + Controller
ai_command: >
Scaffold a complete NestJS module with its controller and service files.
Use RESTful endpoints and dependency injection best practices.
description: Automatically scaffold a full NestJS feature module.

## 🗃️ Generate Drizzle Schema
ai_command: >
Create a Drizzle ORM schema for PostgreSQL based on a model description.
Include proper column types, primary keys, and foreign key relations.
description: Auto-generate a Drizzle ORM schema file from entity or model data.

## 🧪 Generate Jest Test File
ai_command: >
Generate a Jest unit test file for a given NestJS service or controller.
Include positive and negative test cases with mocks.
description: Automatically create Jest test templates for new or existing modules.

## ⚡ Generate Swagger Decorators
ai_command: >
Add Swagger decorators (@ApiTags, @ApiResponse, @ApiOperation) to a NestJS controller for documentation.
description: Use Warp AI to enhance API documentation with Swagger decorators.

## 📖 Generate README Section
ai_command: >
Write a well-formatted README section for a NestJS module, including its purpose, endpoints, and usage examples.
description: Use Warp AI to generate documentation for a specific backend module.

---

# 🧭 Utilities

## View Swagger Docs
command: open http://localhost:3000/api
description: Open the Swagger API documentation in the browser.

## Check environment variables
command: printenv | grep DATABASE_URL
description: Display the configured database environment variable.

## Clean and reinstall dependencies
command: rm -rf node_modules && pnpm install
description: Remove node_modules and reinstall all dependencies fresh.

## Rebuild project
command: pnpm run build
description: Compile TypeScript to JavaScript for production.

---

# 🧹 Maintenance

## Update dependencies
command: pnpm update
description: Update all outdated dependencies to their latest versions.

## Check outdated dependencies
command: pnpm outdated
description: List all outdated packages.

## Audit vulnerabilities
command: pnpm audit
description: Check for known security vulnerabilities in project dependencies.

---

# 🧭 Git & CI Utilities

## Run pre-commit checks
command: pnpm run lint && pnpm run test
description: Run linting and tests before committing changes.

## Push current branch
command: git push origin $(git branch --show-current)
description: Push your active branch to the remote repository.

## Create version tag
command: git tag -a v$(node -p "require('./package.json').version") -m "Release"
description: Tag the current commit with the version from package.json.

---

# ✅ Quick Help

## List all workflows
command: warp workflows list
description: Display all available Warp workflows for this project.

## Run specific workflow
command: warp workflows run
description: Trigger a chosen workflow from the Warp command palette.