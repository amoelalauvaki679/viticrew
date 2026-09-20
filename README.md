# VitiCrew

Fijian seafarers for yachts crossing the Pacific and into Asia.

Crew cards, document tickets, and one share link for yacht desks from Denarau to Phuket. Built for local seafarers; read by agents across Asia-Pacific.

## What it does

- **Crew cards** — photo, rank, home island, availability, and a public share URL (`/c/…`)
- **Tickets** — passport, seaman’s book, STCW, medical, and other docs on the card
- **Profile views** — see which desks opened your card
- **Jobs** — open berths on Pacific–Asia routes
- **Corridor briefing** — local Pacific / Asia yacht news agents can forward (`/news/…`)
- **Agent desks** — listings from Vila through to Manila and Singapore

Sign in with Google, X, or email. Public crew cards and briefing articles do not require an account.

## GitHub vs the live app

Pushing this repo to GitHub **only stores the source**. It does not:

- launch VitiCrew on the web
- run database migrations
- inject auth or database secrets
- deploy to Vercel

The live app is published separately (Grok / Vercel). GitHub is a backup and a place to collaborate. Keep secrets out of the repo — `DATABASE_URL`, auth keys, and `.env` files belong in the host’s environment, not in git.

## Stack

- React 19, TanStack Start / Router / Query, Tailwind v4
- Better Auth (Google, X, email/password)
- Postgres (Neon in production; embedded PGLite when `DATABASE_URL` is unset)

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default port 8080).

```bash
npm run typecheck
npm run build
```

### Environment (production)

Set these on the host. Do not commit them.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon (or other Postgres) connection string |
| `BETTER_AUTH_URL` | Public origin of the deployed app |
| `BETTER_AUTH_SECRET` | Auth signing secret |
| `GROK_AUTH_*` | Injected by the Grok deployer for Google / X |

Without `DATABASE_URL`, the app uses an in-memory Postgres (PGLite). Data does not survive a restart. That is fine for local preview; production needs Neon.

Migrations live in `migrations/` and apply on `npm run build` when `DATABASE_URL` is set.

## What not to commit

`.gitignore` already excludes:

- `node_modules/`
- build output (`.output/`, `.vercel/`, `dist/`)
- screenshots and other QA dumps
- `.env` and key files
- Grok sandbox skills / agent docs

If you add GitHub Actions later, they still will not publish the live app unless you wire a separate deploy (Vercel, etc.) with the env vars above.
