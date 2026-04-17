# Rails React Vite Template — AI Assistant Guide

> `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks to this file, so Claude Code, GitHub Copilot, and Codex all read the same source of truth.

Minimal Rails 8 + React 19 + Vite starter.

## Tech Stack

| Layer           | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| Backend         | Ruby 3.3.7, Rails 8.0.2, PostgreSQL                               |
| Asset pipeline  | Propshaft + jsbundling-rails (esbuild) + cssbundling-rails + vite_rails |
| Solid Stack     | Solid Queue, Solid Cache, Solid Cable                             |
| Frontend        | React 19, Vite 5, Tailwind CSS 4                                  |
| Serialization   | Alba                                                              |
| Linting         | RuboCop (rails-omakase), Brakeman, ESLint 9, Prettier 3           |
| Node            | 22.14 (`.node-version`)                                           |

## Development

`bin/dev` (or `yarn dev`) runs `Procfile.dev` via foreman — starts `rails server`, `yarn build --watch` (esbuild), `yarn build:css --watch` (Tailwind CLI), and `bin/vite dev` (HMR). All four are required.

## Frontend Conventions

- React code lives in `app/frontend/` (not `app/javascript/`); entrypoint is `app/frontend/entrypoints/application.js`, mounted into `<div id="root">` by `app/views/app/index.html.erb`.
- **Functional components only**, no class components.
- JSX is written in `.js` files — `vite.config.mts` loads `.js` with the `jsx` esbuild loader.
- React 19 automatic JSX — do **not** `import React from "react"`.
- Import alias `~/` → `app/frontend/`, declared in three places that must stay in sync: `vite.config.mts`, `eslint.config.mjs`, and `jsconfig.json`.
- Tailwind 4 via `@tailwindcss/vite` (dev HMR) and `@tailwindcss/cli` (prod build from `app/assets/stylesheets/application.tailwind.css`). `prettier-plugin-tailwindcss` sorts classes — don't reorder by hand.
- New pages are client-side routes inside React, not ERB views.

## Backend Conventions

- Follow `rubocop-rails-omakase`.
- Controllers stay thin; keep business logic in models.
- Jobs in `app/jobs/` call a single method on a model or service.
- Use Alba for JSON serialization.
- Default to the Solid Stack (Queue / Cache / Cable) for async, caching, and ActionCable.

## General

- Prefer clarity over cleverness.
- No commented-out code or debug logs.
- Keep this file short — expand it as real patterns emerge in the project.
