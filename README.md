# Keepsake — A Letter For You

A cinematic, handwritten-feeling farewell site with real accounts behind it:
an **admin side** for managing companies, employees, and their letters, and
a **private employee side** where each person logs in with just their
employee ID to read their letter and write back in a threaded conversation.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion,
and Drizzle ORM over Postgres.

## How it works

- **Admins** sign in at `/admin/login` with an email and password. From
  there they create **companies** (e.g. ACX, BSL — add as many as you like),
  add **employees** to a company along with their letter content, and reply
  to employees inside each conversation thread.
- **Employees** sign in at `/login` with **only their employee ID** — no
  password. They land on `/letter`, their own private page: an envelope
  opens into their letter, a photo gallery, a timeline, gratitude notes, and
  a closing scene. Below all of that is a conversation thread where they can
  write back.
- Every time an employee **sends a message**, an email is sent to
  **groverlakshya.25.lg@gmail.com** with what they wrote and a link straight
  to that conversation in the admin panel.
- The first time someone opens their letter, their name appears
  handwritten across the envelope. Once they reach the end, a floating
  button quietly becomes **"Keep this memory."**

## Run it locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up your environment** — copy `.env.example` to `.env` and fill it
   in (see the comments in that file for where to get each value):

   ```bash
   cp .env.example .env
   ```

   At minimum you need `DATABASE_URL` (any Postgres instance) and
   `SESSION_SECRET` (a random string).

3. **Push the database schema**

   ```bash
   npm run db:push
   ```

4. **Seed an admin account, two companies, and a few sample letters**

   ```bash
   npm run db:seed
   ```

   This creates:
   - Companies **ACX** and **BSL**
   - An admin account using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`
   - Three sample employees you can log in as immediately: `ACX-1001`,
     `ACX-1002`, and `BSL-2001`

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Try the employee
   flow with `ACX-1001`, and the admin flow at `/admin/login` with the
   email/password you set in `.env`.

## Using it

### As an admin

1. Sign in at `/admin/login`.
2. On the dashboard, add a company (name only — a URL-safe slug is
   generated automatically).
3. Open a company and fill in the **"Add an employee"** form:
   - Employee ID (this is what they'll type in at `/login`)
   - Name, team, a short quote, and an optional photo URL
   - The letter itself — write it as separate paragraphs, with a blank
     line between each one
   - Optional: timeline steps, memory photos, and gratitude notes, each
     added with their own "Add" button
4. Click into any employee to read the conversation and reply. Your reply
   shows up in their thread right away.
5. Add more admins from the settings page (top-right gear icon).

### As an employee

1. Go to `/login` and enter your employee ID.
2. Open the envelope, scroll through the letter, gallery, timeline, and
   gratitude notes.
3. Scroll to the bottom to **write back** — anything sent there emails
   groverlakshya.25.lg@gmail.com and shows up for the admin to reply to.

## Run it with Docker

Everything — the app and its own Postgres database — runs with one command:

```bash
docker compose up --build
```

This starts three containers:

- **`db`** — Postgres 16, with its data kept in a named volume so it
  survives restarts.
- **`migrate`** — runs once, pushes the database schema, seeds companies
  (ACX, BSL), an admin account, and the sample letters, then exits.
- **`app`** — the Next.js app itself, on [http://localhost:3000](http://localhost:3000),
  which only starts once `migrate` finishes successfully.

The compose file ships with working default values for every secret, all
following the same `<name>_farewell_key` pattern, so it runs out of the box
with no `.env` file required:

| Variable            | Default                    |
| -------------------- | --------------------------- |
| `SESSION_SECRET`     | `session_farewell_key`      |
| `ADMIN_PASSWORD`     | `admin_farewell_key`        |
| `POSTGRES_PASSWORD`  | `postgres_farewell_key`     |
| `RESEND_API_KEY`     | `resend_farewell_key`       |

Sign in as admin at `/admin/login` with `admin@keepsake.local` /
`admin_farewell_key`, or as an employee at `/login` with `ACX-1001`.

To change any of these, edit the `environment:` blocks in
`docker-compose.yml` directly — since `RESEND_API_KEY` is a placeholder
value rather than a real Resend key, reply emails will log a "skipping
email notification" message instead of sending until you swap in a real
key from [resend.com](https://resend.com).

To stop everything (and keep the database volume for next time):

```bash
docker compose down
```

To also wipe the database:

```bash
docker compose down -v
```

### Building the image by itself

The `Dockerfile` has two targets: `builder` (full dependencies, used to run
`db:push`/`db:seed`) and `runner` (a slim standalone build, used for the
running app). If you want to build just the app image:

```bash
docker build --target runner -t keepsake-app .
```

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Provision a Postgres database — [Neon](https://neon.tech) and
   [Vercel Postgres](https://vercel.com/storage/postgres) both have free
   tiers that work well here.
3. Import the repository at [vercel.com/new](https://vercel.com/new) and
   add the environment variables from `.env.example`.
4. After the first deploy, run the schema push and seed once, pointed at
   your production database:

   ```bash
   DATABASE_URL="your-production-url" npm run db:push
   DATABASE_URL="your-production-url" npm run db:seed
   ```

5. Set up [Resend](https://resend.com) (free tier available), add
   `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Vercel's environment
   variables, and redeploy — reply emails will start arriving at
   groverlakshya.25.lg@gmail.com.

## What's inside

- **`/`** — cinematic landing page with a typewriter intro.
- **`/login`** — employee ID–only sign-in.
- **`/letter`** — the private, authenticated letter experience: envelope,
  scroll-revealed letter, photo gallery, timeline, gratitude cards, a dark
  closing scene, and a reply thread.
- **`/admin/login`** — admin email/password sign-in.
- **`/admin`** — company list + "add company."
- **`/admin/companies/[id]`** — employees in that company + "add employee"
  (with the full letter-content form).
- **`/admin/users/[id]`** — one employee's letter (collapsed) and their
  conversation thread, with a reply box.
- **`/admin/settings`** — manage additional admin accounts.
- **Database** — Postgres via Drizzle ORM (`db/schema.ts`). Four tables:
  `companies`, `admins`, `users` (employees), and `thread_messages`.
- **Sessions** — signed, httpOnly cookies (no third-party auth service).
  Admin passwords are hashed with Node's built-in `scrypt`.
- **Email** — [Resend](https://resend.com) sends a notification to
  groverlakshya.25.lg@gmail.com on every employee reply. Without
  `RESEND_API_KEY` set, it just logs instead of sending, so local dev works
  without an email account.
- **Ambient music** — a soft generative pad synthesized with the Web Audio
  API, so there's no licensed MP3 to host.
- **Docker** — `Dockerfile` (multi-stage: full-dependency `builder` stage
  for migrations, slim standalone `runner` stage for the app) and
  `docker-compose.yml` (Postgres + a one-off migrate/seed step + the app),
  so `docker compose up --build` is enough to run the whole thing.
- Dark mode, reading-progress bar, custom cursor glow, and full SEO
  metadata (public pages only — `/admin` and `/letter` are excluded from
  the sitemap and disallowed in `robots.txt`).

## Notes

- Everyone's employee ID must be unique across the whole system (it's how
  they log in), so pick a scheme like `ACX-1001` that includes the company.
- All motion respects `prefers-reduced-motion`.
- To change the sign-off name ("— Lakshya"), search for `Lakshya` in
  `components/letter-experience.tsx` and `components/surprise-ending.tsx`.
