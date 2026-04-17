# Rails React Vite Template — AI Assistant Guide

> Canonical development guide for projects based on this template.
>
> `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks to this file, so Claude Code, GitHub Copilot, and Codex all read the same source of truth.

This repository is a minimal Rails 8 + React 19 + Vite starter. It is a **clean slate** — there is no business logic yet. When you work on a project cloned from this template, follow the conventions below. When a subsystem does not yet exist (auth, services, API layer, docs, etc.), the "When Extending the Template" section tells you where it should go.

---

## Architecture Overview

Hybrid Rails/React application. Rails serves a single ERB shell (`app/views/app/index.html.erb`) containing `<div id="root">`; React takes over as an SPA via Vite, mounted in `app/frontend/entrypoints/application.js`.

### Tech Stack

| Layer           | Technology                                                  |
| --------------- | ----------------------------------------------------------- |
| Backend         | Ruby 3.3.7, Rails 8.0.2                                     |
| Database        | PostgreSQL                                                  |
| Web Server      | Puma + Thruster (HTTP caching/compression)                  |
| Asset Pipeline  | Propshaft                                                   |
| JS bundling     | jsbundling-rails (esbuild) + vite_rails (dev HMR)           |
| CSS bundling    | cssbundling-rails (Tailwind CLI) + `@tailwindcss/vite` (HMR) |
| Background Jobs | Solid Queue (Sidekiq + Redis available in Gemfile, not wired) |
| Cache           | Solid Cache                                                 |
| Real-time       | Solid Cable                                                 |
| Frontend        | React 19.1.1, Vite 5, Tailwind CSS 4.1.11                   |
| Serialization   | Alba, jbuilder                                              |
| HTTP Client     | HTTParty                                                    |
| Testing         | Minitest + Capybara + Selenium (headless Chrome)            |
| Linting         | RuboCop (rails-omakase), Brakeman, ESLint 9, Prettier 3     |
| Deploy          | Kamal + Docker                                              |
| Node            | 22.14.0 (pinned via `.node-version`)                        |
| Yarn            | 1.22                                                        |

---

## Repository Layout

```
app/
  controllers/
    app_controller.rb          # Renders the React shell
    application_controller.rb
  frontend/                    # All React code lives here (not app/javascript/)
    components/
      App.js                   # Root React component
    entrypoints/
      application.js           # createRoot + mount to #root
      application.css          # Main CSS entry (imports Tailwind)
  assets/
    builds/                    # Generated JS/CSS from esbuild / Tailwind CLI
    images/
    stylesheets/
      application.tailwind.css # Tailwind entry for the CLI build
  jobs/                        # ActiveJob classes (delegate to models/services)
  mailers/
  models/
    application_record.rb
    concerns/
  views/
    app/index.html.erb         # The only real view — <div id="root">
    layouts/application.html.erb
    pwa/                       # Manifest + service worker (routes commented out)
config/
  routes.rb                    # Minimal — root → app#index + health check
  application.rb
  database.yml                 # Separate shards for cache / queue / cable in prod
  cache.yml / queue.yml / cable.yml  # Solid Stack config
  deploy.yml                   # Kamal manifest (rename service per project)
  puma.rb
  initializers/
db/
  schema.rb                    # Main schema (no migrations yet — add under db/migrate/)
  cache_schema.rb
  queue_schema.rb
  cable_schema.rb
  seeds.rb
test/                          # Minitest, not RSpec
  fixtures/
  application_system_test_case.rb
bin/
  dev                          # Runs Procfile.dev via foreman
Procfile.dev                   # web / js / css / vite processes
vite.config.mts
eslint.config.mjs
jsconfig.json
Dockerfile                     # Multi-stage, runs as rails:1000
```

### Directories that don't exist yet

These are **intentionally absent**. Create them only when the first use case appears, and update this file when you do:

- `app/services/` — service objects
- `app/workers/` — only if you wire up Sidekiq alongside (or instead of) Solid Queue
- `app/controllers/api/` or `app/grape/` — when you add an API layer
- `docs/` — subsystem guides
- `config/locales/` beyond `en.yml` — when you add i18n
- Any auth directories (`app/models/user.rb`, Devise config) — add deliberately

### Key Files to Understand First

- `config/routes.rb` — currently only the health check and `root "app#index"`; add routes here
- `app/frontend/entrypoints/application.js` — React mount point
- `app/views/layouts/application.html.erb` — `vite_client_tag`, `vite_javascript_tag`, `vite_stylesheet_tag`
- `vite.config.mts` — RubyPlugin + React + Tailwind; configured so `.js` files are loaded as JSX
- `Procfile.dev` — the four dev processes
- `package.json` and `Gemfile` — dependencies
- `eslint.config.mjs` and `jsconfig.json` — the `~/` → `app/frontend/` alias lives here

---

## Development Workflow

### Starting the App

```bash
bin/dev        # same as: yarn dev
```

`bin/dev` runs `Procfile.dev` through foreman:

- `web`: `env RUBY_DEBUG_OPEN=true bin/rails server` (port 3000)
- `js`: `yarn build --watch` (esbuild bundling `app/frontend/*.* → app/assets/builds`)
- `css`: `yarn build:css --watch` (Tailwind CLI → `app/assets/builds/application.css`)
- `vite`: `bin/vite dev` (HMR dev server)

All four processes are needed for a functioning dev environment. Vite provides HMR; esbuild + Tailwind CLI produce the Propshaft-served build artifacts.

### Useful Commands

```bash
bin/rails test              # Minitest unit tests
bin/rails test:system       # Capybara + headless Chrome
bin/rails db:test:prepare   # Prepare test DB (matches CI)
bin/rubocop -a              # Auto-fix Ruby style
yarn eslint .               # Lint JS
bin/brakeman                # Security scan
bundle exec annotaterb models  # Regenerate model annotations
bin/kamal deploy            # Deploy
```

### CI

`.github/workflows/ci.yml` runs Brakeman, RuboCop, JS import scan, and `bin/rails db:test:prepare test test:system` with a PostgreSQL service container and headless Chrome. Keep all three green.

---

## Key Conventions

### Multi-tenancy

**Not wired yet.** This template has no user model, no organization model, no tenant scope. When you add multi-tenancy, thread the tenant through React providers on the frontend and controller/service context on the backend, and scope every ActiveRecord query accordingly. Update this section when the pattern lands.

### File Naming

- **React components**: PascalCase (e.g., `App.js`, `UserMenu.js`)
- **Ruby classes**: snake_case files, PascalCase class names
- File name matches the main exported class/component
- Group by feature/responsibility, not by type

### Backend Patterns

- Follow `rubocop-rails-omakase` style
- Controllers stay thin — delegate to models, or to service objects under `app/services/` once that directory exists (create `ApplicationService` as the base class when you do)
- Jobs in `app/jobs/` call **a single method** on a model or service; no business logic inside jobs
- Use Alba for JSON serialization
- Schema source of truth is `db/schema.rb` (Rails default — not `structure.sql`); add migrations under `db/migrate/`
- Prefer Rails idioms over raw Ruby:

```ruby
# Good
value.try(method_name.to_sym) || default_value
array.present?
hash.slice(:key1, :key2)

# Avoid
begin
  value.send(method_name)
rescue StandardError
  default_value
end
!array.nil? && !array.empty?
{ key1: hash[:key1], key2: hash[:key2] }
```

### Frontend Patterns

- **All React components are functional components with hooks** — no class components
- File extension is `.js` even for JSX (`vite.config.mts` loads `.js` with the `jsx` loader)
- Import alias `~/` → `app/frontend/` — declared in three places that must stay in sync: `vite.config.mts` (via `vite-plugin-ruby`), `eslint.config.mjs` (resolver), and `jsconfig.json` (editor)
- React 19 automatic JSX transform — **do not** `import React from "react"` in component files
- Components live in `app/frontend/components/`, grouped by feature as the app grows
- Import order: builtin → external → internal → parent → sibling → index (enforced by `eslint-plugin-import`)
- Unused imports are auto-removed by `eslint-plugin-unused-imports`

Example root component:

```js
// app/frontend/entrypoints/application.js
import { createRoot } from "react-dom/client";
import "./application.css";
import App from "~/components/App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

### Styling

- Tailwind CSS 4 with two integrations:
  - `@tailwindcss/vite` during dev (HMR)
  - `@tailwindcss/cli` for the production build (`yarn build:css`)
- Entry: `app/assets/stylesheets/application.tailwind.css`
- `prettier-plugin-tailwindcss` sorts classes on save/commit — do not reorder by hand

### Views

The only server-rendered page is `app/views/app/index.html.erb` (the React root div). New pages should be **client-side routes inside React**, not new ERB views. ERB is for the shell, the mailer templates, and the PWA manifest/service worker only.

### Background Jobs, Cache, Cable

Default to the Rails 8 **Solid Stack** already configured:

- **Solid Queue** for jobs (`config/queue.yml`) — runs inside Puma when `SOLID_QUEUE_IN_PUMA=1` (Kamal default), or as a separate process otherwise
- **Solid Cache** for `Rails.cache` (`config/cache.yml`)
- **Solid Cable** for ActionCable in production (`config/cable.yml`; dev/test use async)

Sidekiq and Redis are in the `Gemfile` but **not wired up**. Only reach for them if a feature truly needs Sidekiq-specific behavior; document the reason when you do.

### Authentication

**Not wired yet.** No Devise, no `has_secure_password`, no Doorkeeper. When adding auth, prefer either Rails 8's built-in `bin/rails generate authentication` or Devise. Update this section once chosen.

### Real-time

Solid Cable is configured for production but no channels exist. Add channels under `app/channels/` and subscribe from React via hooks when needed.

### Internationalization

Only `config/locales/en.yml` exists. When the product needs additional locales, add them here (backend) and introduce an i18n library on the frontend (e.g., i18next). Document the choice in this file.

### Error Handling

No Sentry, no Rollbar, no structured error reporting yet. Add one at the point real user traffic starts. Validate inputs at the controller boundary, fail fast when assumptions break, and log enough context to debug without dumping everything.

---

## Testing

- **Minitest** (Rails default) — no RSpec, no FactoryBot, no shoulda-matchers
- Fixtures live in `test/fixtures/`
- System tests use Selenium + headless Chrome at 1400×1400 (`test/application_system_test_case.rb`)
- Parallel test execution is enabled
- Test behavior, not implementation details — fewer meaningful tests beat many brittle ones
- Keep tests deterministic; no reliance on wall-clock time or external HTTP

```bash
bin/rails test                    # unit + integration
bin/rails test:system             # Capybara system tests
bin/rails test TEST=test/models/foo_test.rb  # single file
```

CI runs `bin/rails db:test:prepare test test:system` end-to-end.

---

## Code Quality

- **ESLint 9** flat config (`eslint.config.mjs`) with plugins: `react`, `import`, `unused-imports`, `prettier`. Rules include `react/jsx-no-undef`, `unused-imports/no-unused-imports`, `import/no-duplicates`, `import/no-unresolved`. React 19 means `react/react-in-jsx-scope` is off.
- **Prettier 3** with `prettier-plugin-tailwindcss` — semicolons, ES5 trailing commas, Tailwind class sorting
- **RuboCop** inherits from `rubocop-rails-omakase`
- **Brakeman** for security scans in CI
- Node locked to `22.x` via `.node-version`; Ruby to `3.3.7` via `.ruby-version`. Keep both in sync with `Dockerfile`, `package.json` → `engines`, and CI.

### General Principles

- Follow existing patterns before inventing new ones
- Prefer clarity over cleverness
- Keep business logic out of controllers, jobs, and UI bindings
- Keep files focused on one responsibility
- No commented-out code or debug logs
- Refactor opportunistically when touching nearby code
- Assume readers are tired and in a hurry

---

## Deployment

- Multi-stage `Dockerfile` — build stage installs gems + node modules and precompiles assets; runtime image is minimal and runs as user `rails:1000`
- Entrypoint: `bin/docker-entrypoint`; `CMD` is `./bin/thrust ./bin/rails server` (Thruster fronts Puma for HTTP caching, compression, and X-Sendfile)
- `config/deploy.yml` is the Kamal manifest — **rename the `service:` placeholder** per project before the first deploy
- Secrets: `RAILS_MASTER_KEY` is the only required secret; `SOLID_QUEUE_IN_PUMA=1` runs jobs inside the web container

---

## When Extending the Template

Add subsystems deliberately — don't pre-build what the project doesn't need. When you do add one, create the relevant files and update this guide in the same PR.

| Need                | Where it goes                                                      |
| ------------------- | ------------------------------------------------------------------ |
| Authentication      | Rails 8 built-in generator, or Devise. Update the Auth section.    |
| Authorization       | Pundit or ActionPolicy under `app/policies/`                       |
| Admin               | Avo or ActiveAdmin, mounted under a subdomain or `/admin`          |
| API layer           | Start with `app/controllers/api/v1/`; upgrade to Grape if complex  |
| Service objects     | Create `app/services/` with an `ApplicationService` base class     |
| Workers (Sidekiq)   | Only if needed; `app/workers/` alongside Solid Queue               |
| Multi-tenancy       | Add tenant model; scope every query; thread through React context  |
| Real-time channels  | `app/channels/` + React hooks; Solid Cable is already configured   |
| Additional locales  | `config/locales/` (backend) + i18next or similar (frontend)        |
| Error tracking      | Sentry (`sentry-ruby`, `sentry-rails`, `@sentry/react`)            |
| Subsystem docs      | `docs/*.md`; link from the index below                             |

---

## Subsystem Documentation Index

No subsystem docs exist yet. When you add one to `docs/`, link it here:

| Topic | File |
| ----- | ---- |

---

## Codebase Hygiene

- No temporary files in the repo root — no perf scripts, one-off notes, or summary files outside `docs/temp/` (and remove those once the work ships)
- Keep this file up to date — when you add a subsystem, update the relevant section here rather than creating a parallel AI-assistant doc
- Document what future developers need to know, not historical decisions — those belong in PR descriptions and the git log
- One file per subject in `docs/`; cross-reference rather than duplicate
