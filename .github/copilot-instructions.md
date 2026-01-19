# Copilot Instructions

This document provides context and conventions for working with this Rails + React + Vite application.

## Tech Stack

### Backend
- **Rails 8.0.2**: Modern Ruby on Rails framework
- **Ruby 3.3.7**: Ruby version
- **PostgreSQL**: Primary database with separate databases for cache, queue, and cable in production
- **Puma**: Web server
- **Sidekiq**: Background job processing with Redis
- **Solid Cache, Solid Queue, Solid Cable**: Rails 8 database-backed adapters for caching, jobs, and WebSocket connections

### Frontend
- **React 19.1.1**: UI library using functional components and hooks
- **Vite 5.0.0**: Fast build tool and dev server with Hot Module Replacement (HMR)
- **Tailwind CSS 4.1.11**: Utility-first CSS framework
- **vite-ruby**: Integration between Vite and Rails

### Build Tools & Linting
- **esbuild**: JavaScript bundler for production builds
- **ESLint 9**: JavaScript linter with React, Prettier, Import, and Unused Imports plugins
- **Prettier 3.6.2**: Code formatter with Tailwind plugin
- **RuboCop**: Ruby linter using rails-omakase configuration
- **Brakeman**: Security scanner for Rails applications

### DevOps & Deployment
- **Kamal**: Docker-based deployment tool
- **Docker**: Containerization with multi-stage builds
- **Thruster**: HTTP asset caching/compression and X-Sendfile acceleration for Puma
- **Node 22.14.0**: JavaScript runtime
- **Yarn 1.22.22**: Package manager

### Additional Libraries
- **Alba**: JSON serialization for APIs
- **HTTParty**: HTTP client library
- **jsbundling-rails**: JavaScript bundling integration
- **cssbundling-rails**: CSS bundling integration

## Project Structure

### Frontend Organization
```
app/frontend/
├── components/     # React components (e.g., App.js)
└── entrypoints/    # Application entry points (e.g., application.js)
```

- **Import Alias**: Use `~/` to reference files from `app/frontend/` (configured in jsconfig.json and eslint)
- **Entry Point**: `app/frontend/entrypoints/application.js` mounts React to `#root` element
- **Components**: Use functional components with hooks, keep them small and composable

### Backend Organization
```
app/
├── controllers/    # Request handlers (thin, delegate to models/services)
├── models/         # ActiveRecord models and business logic
├── jobs/           # Sidekiq background jobs (should be focused and delegate work)
├── mailers/        # Email templates and logic
├── views/          # ERB templates
└── helpers/        # View helpers
```

### Configuration Files
- **Vite Config**: `vite.config.mts` - Configures Vite with Ruby plugin, React, and Tailwind
- **ESLint Config**: `eslint.config.mjs` - Flat config format with import resolution
- **Prettier Config**: `.prettierrc` - Semicolons, ES5 trailing commas, Tailwind plugin
- **RuboCop Config**: `.rubocop.yml` - Inherits from rubocop-rails-omakase
- **jsconfig.json**: Configures path aliases and JSX support

## Development Workflow

### Starting the Development Server
```bash
yarn dev
# or
bin/dev
```

This starts four processes (via Procfile.dev):
1. Rails server (with Ruby debug enabled)
2. JavaScript build watcher (esbuild)
3. CSS build watcher (Tailwind)
4. Vite dev server (HMR)

### Running Tests
```bash
bin/rails test              # Run all tests
bin/rails test:system       # Run system tests only
bin/rails db:test:prepare   # Prepare test database
```

### Linting and Formatting
```bash
bin/rubocop                 # Lint Ruby code
bin/rubocop -a             # Auto-correct Ruby issues
bin/brakeman               # Security scan
# Note: No specific npm scripts for ESLint/Prettier in package.json
```

### Building for Production
```bash
yarn build        # Build JavaScript
yarn build:css    # Build CSS
```

## Code Conventions

### JavaScript/React Style
- **Components**: Use functional components with React hooks, not class components
- **Imports**: Group and order imports (builtin → external → internal → parent → sibling → index)
- **Import Paths**: Use `~/` alias for app/frontend imports, avoid deep relative imports
- **Unused Imports**: Automatically removed (enforced by ESLint)
- **JSX**: .js files can contain JSX (configured in Vite esbuild settings)
- **React Scope**: No need to import React in JSX files (React 19 behavior)
- **Formatting**: Prettier runs as ESLint warning, use semicolons and ES5 trailing commas

### Ruby/Rails Style
- **Style Guide**: Follows rubocop-rails-omakase conventions
- **Controllers**: Keep thin, delegate business logic to models or service objects
- **Jobs**: Should do one thing and delegate work to models or services
- **Models**: Use ActiveRecord idiomatically, keep business logic here
- **Security**: Brakeman scans are part of CI pipeline

### File Naming
- **Components**: PascalCase for React component names (e.g., `App.js`)
- **Ruby Files**: snake_case following Rails conventions
- **Alignment**: File names should match the main exported class or component

### Testing
- **Framework**: Minitest (Rails default)
- **System Tests**: Capybara with Selenium WebDriver (Chrome)
- **Fixtures**: Located in `test/fixtures/`
- **Test Types**: Controllers, models, helpers, integration, system tests

### API Design
- **Serialization**: Use Alba for JSON serialization
- **Format**: Follow REST-style conventions
- **Validation**: Validate inputs at controller boundary
- **Error Handling**: Centralize error reporting, fail fast when assumptions break

## Database
- **Adapter**: PostgreSQL
- **Development DB**: `strike_against_the_archive_development`
- **Test DB**: `strike_against_the_archive_test`
- **Production**: Multi-database setup (primary, cache, queue, cable)
- **Migrations**: Standard Rails migrations in `db/migrate/`

## Environment & Configuration
- **Environment Variables**: Use dotenv-rails in development/test
- **Credentials**: Use Rails encrypted credentials for sensitive data
- **Auto-loading**: Standard Rails autoload paths, lib/ configured with `config.autoload_lib(ignore: %w[assets tasks])`

## Docker & Deployment
- **Dockerfile**: Multi-stage build optimized for production
- **Base Image**: Ruby 3.3.7-slim with Node 22.14.0
- **Deployment**: Kamal-ready configuration
- **Web Server**: Puma with Thruster for asset optimization

## CI/CD Pipeline
The `.github/workflows/ci.yml` defines three jobs:
1. **scan_ruby**: Runs Brakeman security scanner
2. **lint**: Runs RuboCop for code style
3. **test**: Runs full test suite with PostgreSQL service

---

# Copilot Instructions (Generic, Non-Domain Specific)

## General Principles

- Follow existing patterns before inventing new ones.
- Prefer clarity over cleverness.
- Keep business logic out of glue code (controllers, jobs, UI bindings).
- Clean up temporary code and files once the task is done.
- Commit only production-worthy code.

## File and Naming Conventions

- Use PascalCase for component and class names.
- Use snake_case for file names when the language ecosystem expects it.
- Keep file names aligned with the main exported class or component.
- Keep related files grouped in folders by responsibility, not by type.

## Backend Coding Style

- Favor framework-idiomatic helpers over low-level language constructs.
- Prefer small, focused service objects for business logic.
- Jobs/workers should:
  - Do one thing.
  - Delegate work to a model or service.
  - Contain no business rules.
- Avoid defensive try/catch patterns when safer helpers exist.
- Prefer readable intent over micro-optimizations unless proven necessary.

## Frontend Coding Style

- Use functional components and hooks.
- Avoid class components unless strictly required.
- Keep components small and composable.
- Co-locate styles with components when they are tightly coupled.
- Separate data fetching logic from rendering logic.
- Prefer declarative state management patterns.

## JavaScript / TypeScript Practices

- Use consistent import paths and aliases.
- Avoid deep relative imports.
- Keep side effects explicit.
- Prefer immutable data patterns.
- Keep files focused: one main responsibility per file.

## API & Data Access

- Use clear, REST-style naming conventions.
- Keep API layers thin.
- Validate inputs at the boundary.
- Log errors centrally, not ad hoc.
- Prefer explicit scopes and filters to avoid unintended data access.

## Error Handling

- Fail fast when assumptions are broken.
- Centralize error reporting.
- Use error boundaries or equivalents for UI isolation.
- Log enough context to debug, not everything.

## Testing & Quality

- Write tests close to the level of behavior you care about.
- Prefer fewer, meaningful tests over many brittle ones.
- Use factories or fixtures consistently.
- Keep tests deterministic.
- Run linters and formatters automatically.

## Codebase Hygiene

- Do not leave commented-out code.
- Avoid debug logs in committed code.
- Refactor opportunistically when touching related code.
- Keep configuration explicit and documented.
- Assume future readers are tired and in a hurry.

## Development Workflow

- Use existing scripts and tooling instead of ad hoc commands.
- Prefer reproducible workflows.
- Keep environment assumptions explicit.
- Document non-obvious decisions in code comments, not commit messages.
