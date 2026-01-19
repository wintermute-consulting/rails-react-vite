# Copilot Instructions

## Tech Stack
- Rails 8.0.2, Ruby 3.3.7, PostgreSQL
- React 19.1.1, Vite 5.0.0, Tailwind CSS 4.1.11
- Sidekiq with Redis, Solid Cache/Queue/Cable
- ESLint 9, Prettier, RuboCop (rails-omakase), Brakeman

## Project Structure

```
app/frontend/
├── components/     # React components
└── entrypoints/    # application.js mounts React to #root

app/
├── controllers/    # Thin, delegate to models/services
├── models/         # Business logic
├── jobs/           # Sidekiq jobs, delegate work
└── views/          # ERB templates
```

## Development Commands
```bash
yarn dev            # Start all processes (Rails, Vite, esbuild, Tailwind)
bin/rails test      # Run tests (Minitest, Capybara)
bin/rubocop -a      # Lint/fix Ruby code
```

## Coding Conventions

### General Principles
- Follow existing patterns before inventing new ones
- Prefer clarity over cleverness
- Keep business logic out of controllers, jobs, UI bindings
- Keep files focused on one responsibility

### React/JavaScript
- Use functional components with hooks only, not class components
- Import paths: Use `~/` alias for `app/frontend/` imports
- No need to import React in JSX files (React 19)
- Import order: builtin → external → internal → parent → sibling → index
- Unused imports automatically removed by ESLint
- Formatting: semicolons, ES5 trailing commas (Prettier)
- Keep components small and composable
- Separate data fetching from rendering

### Ruby/Rails
- Follow rubocop-rails-omakase conventions
- Controllers: Thin, delegate to models or service objects
- Jobs: Do one thing, delegate work to models/services, no business rules
- Models: Use ActiveRecord idiomatically, keep business logic here
- Prefer framework helpers over low-level constructs
- Prefer readable intent over micro-optimizations

### File Naming
- React components: PascalCase (e.g., `App.js`)
- Ruby files: snake_case
- File names match main exported class/component
- Group by responsibility, not by type

### API & Error Handling
- Use Alba for JSON serialization
- Validate inputs at controller boundary
- Centralize error reporting, fail fast when assumptions break
- Log enough context to debug, not everything

### Testing
- Test at the behavior level you care about
- Prefer fewer meaningful tests over many brittle ones
- Use fixtures consistently (in `test/fixtures/`)
- Keep tests deterministic

### Codebase Hygiene
- No commented-out code or debug logs
- Clean up temporary files
- Refactor opportunistically when touching code
- Assume readers are tired and in a hurry
