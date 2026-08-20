# Rails React Vite Template — AI Assistant Guide

> `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks to this file, so Claude Code, GitHub Copilot, and Codex all read the same source of truth.

Rails 8 + React 19 + Vite starter with authentication, background jobs, and cloud storage wired up.

<!-- BEGIN: template setup — delete this note (and the matching README section) once the rename is done -->

> **Fresh clone?** This is still the template: the app is named with the placeholder `RailsReactVite` / `rails_react_vite`. Before building features, rename it to the real project — see "Starting a new project from this template" in `README.md` — then delete this note. If you're an agent and the placeholder name is still present, ask the user what to rename it to before generating new code that hard-codes it.

<!-- END: template setup -->

## Tech Stack

| Layer            | Technology                                                              |
| ---------------- | ---------------------------------------------------------------------- |
| Backend          | Ruby 3.3.7, Rails 8.0.2, PostgreSQL                                    |
| Asset pipeline   | Propshaft + jsbundling-rails (esbuild) + cssbundling-rails + vite_rails |
| Frontend         | React 19, Vite 5, Tailwind CSS 4.3, Heroicons, React Router            |
| Auth             | Devise (JSON endpoints + React views)                                  |
| Background jobs  | Solid Queue on PostgreSQL (Active Job adapter)                         |
| Caching / Cable  | Solid Cache, Solid Cable                                               |
| Storage          | Active Storage → AWS S3 (production), local disk (development)         |
| Serialization    | Alba                                                                    |
| Mail (dev)       | letter_opener                                                          |
| Config           | dotenv-rails (`.env`, see `.env.example`)                              |
| Testing          | RSpec (`rspec-rails`)                                                  |
| Linting / tools  | RuboCop (rails-omakase), Brakeman, ESLint 9, Prettier 3, annotaterb, pry-rails |
| Node             | 22.14 (`.node-version`)                                               |

## Development

- Copy `.env.example` to `.env` and fill in values.
- `bin/dev` (or `yarn dev`) runs `Procfile.dev` via foreman: `rails server`, `yarn build --watch` (esbuild), `yarn build:css --watch` (Tailwind CLI), `bin/vite dev` (HMR), and `bin/jobs` (Solid Queue worker). All are required.
- Tests: `bundle exec rspec`. Models are annotated with `bundle exec annotaterb models`.

## Frontend Conventions

- React code lives in `app/frontend/` (not `app/javascript/`); entrypoint is `app/frontend/entrypoints/application.js`, mounted into `<div id="root">` by `app/views/app/index.html.erb`.
- **Functional components only**, no class components.
- JSX is written in `.js` files — `vite.config.mts` loads `.js` with the `jsx` esbuild loader.
- React 19 automatic JSX — do **not** `import React from "react"`.
- Import alias `~/` → `app/frontend/` is provided by `vite-plugin-ruby` at build time, and mirrored in `eslint.config.mjs` and `jsconfig.json` so linting and editors resolve it too. Keep those two in sync.
- Tailwind 4 via `@tailwindcss/vite` (dev HMR) and `@tailwindcss/cli` (prod build from `app/assets/stylesheets/application.tailwind.css`). `prettier-plugin-tailwindcss` sorts classes — don't reorder by hand.
- Icons come from `@heroicons/react` (e.g. `import { LockClosedIcon } from "@heroicons/react/24/outline"`).
- New pages are client-side routes inside React (React Router in `app/frontend/components/App.js`), not ERB views. Any HTML `GET` not owned by Rails falls through to the SPA (see the catch-all in `config/routes.rb`).
- User-facing strings go through `t()` from `~/i18n`; add keys to `app/frontend/i18n/locales/{en,fr}.js`. Locale is detected once at import time from the browser; `?lang=fr` forces it.
- Read boolean query-string toggles with `useQueryFlag("present")` rather than parsing `location.search` directly — it stays in sync when another component rewrites the URL.

## Auth Conventions

- A site-wide password gate sits in front of everything, independent from Devise. `SitePasswordProtection` (included in `ApplicationController`) redirects HTML requests to `/unlock` and returns `401` JSON until the visitor submits `ENV["PASSWORD"]`; the unlocked state is a digest stored in the Rails session. Blank/unset `PASSWORD` disables the gate entirely, which is the default.
- Devise is API-style: custom controllers under `app/controllers/users/` (`sessions`, `registrations`, `passwords`) respond with JSON, not HTML.
- Failed authentication returns `401 { error: … }` via `JsonFailureApp` (defined in `config/initializers/devise.rb`) instead of redirecting.
- The React frontend talks to Devise through `app/frontend/lib/api.js` (adds the CSRF token + `Accept: application/json`) and `app/frontend/lib/auth.js` (`AuthProvider` / `useAuth`). `GET /current_user` returns the signed-in user.
- Auth screens live in `app/frontend/pages/` (`Login`, `Signup`, `ForgotPassword`, `ResetPassword`). The password-reset email links to the React `/reset-password` route (`app/views/devise/mailer/reset_password_instructions.html.erb`).

## Backend Conventions

- Follow `rubocop-rails-omakase`.
- Controllers stay thin; keep business logic in models.
- Jobs in `app/jobs/` call a single method on a model or service; they run on Solid Queue, backed by the primary Postgres database.
- Serialize JSON with Alba (see `app/serializers/`).
- Use Solid Cache for caching and Solid Cable for Action Cable.

## General

- Prefer clarity over cleverness.
- No commented-out code or debug logs.
- Keep this file short — expand it as real patterns emerge in the project.

## Comments

- Default to no comments; well-named code speaks for itself.
- One line max. Never multi-line blocks or paragraph explanations.
- Only write one for a non-obvious WHY: a hidden constraint, a subtle invariant, a workaround. Never explain WHAT the code does.
