# Rails + React + Vite Template

An opinionated starter for React + Rails apps, with authentication, background
jobs, and cloud storage already wired up so a new project can get going fast.

## Stack

- **Rails 8** (Ruby 3.3), **PostgreSQL**
- **React 19** + **Vite 5** (HMR) + **Tailwind CSS 4.3** + **Heroicons** + **React Router**
- **Devise** for auth, with React login / signup / password views (JSON endpoints)
- **Sidekiq** on **Redis** as the Active Job backend
- **Active Storage** on **AWS S3** (local disk in development)
- **Alba** for JSON serialization
- **letter_opener** to preview emails in development
- **RSpec** for testing, **annotaterb** for schema annotations, **pry-rails**, **dotenv-rails**

## Getting started

```bash
bundle install
yarn install

cp .env.example .env      # then fill in the values

bin/rails db:prepare      # create + migrate

bin/dev                   # or: yarn dev
```

`bin/dev` runs everything in `Procfile.dev` (Rails server, esbuild/Tailwind
watchers, the Vite dev server, and a Sidekiq worker). **Redis must be running**
for Sidekiq. The app is served at http://localhost:3000.

## Environment variables

Configured via `dotenv-rails`; see `.env.example`:

| Variable                                   | Purpose                              |
| ------------------------------------------ | ------------------------------------ |
| `REDIS_URL`                                | Sidekiq / Active Job connection      |
| `MAILER_SENDER`                            | Default "from" address for Devise    |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_BUCKET` | Active Storage S3 (production) |

## Authentication

Devise is set up as a JSON API consumed by React:

- Endpoints live under `/users/*` via custom controllers in `app/controllers/users/`.
- React screens are in `app/frontend/pages/` (`Login`, `Signup`, `ForgotPassword`, `ResetPassword`).
- `GET /current_user` returns the signed-in user; `app/frontend/lib/auth.js` exposes `useAuth()`.

## Background jobs

Active Job runs on Sidekiq (`config/sidekiq.yml`). The dashboard is mounted at
`/sidekiq` — wrap it in an authenticated constraint before deploying.

## Testing

```bash
bundle exec rspec
```

## Common commands

```bash
bin/rubocop                    # Ruby linting
yarn lint                      # (npx eslint "app/frontend/**/*.js")
bundle exec annotaterb models  # refresh model schema annotations
```
