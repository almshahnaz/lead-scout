# Lead Scout — build plan

Companion to `project.md`. Read both at the start of a session. This file is the *how*; `project.md` is the *what/why*.

Primary objective for this build: understanding, not speed. Every section below should end with something concretely visible/working, not just "code written."

## Locked stack decisions

| Decision | Choice | Why (short) |
|---|---|---|
| Backend language | TypeScript on Node.js | One language shared with the frontend; TypeScript's type-checking catches bugs before runtime, which matters most while still learning; the current default at most startups. |
| Frontend | React, via Vite | Dominant frontend library at startups → most docs, most transferable interview skill; builds on React basics already known instead of starting a third ecosystem cold. |
| Backend framework | Express | Most widely used Node framework; deliberately minimal/unopinionated, so building routes and request handling by hand teaches the real mechanics instead of hiding them behind framework magic. |
| Database | PostgreSQL + pgvector | Data is inherently relational (companies → runs → drafts, users → companies); Postgres is the most common production DB with the deepest docs; pgvector stores the RAG embeddings too, avoiding a second database. |
| Hosting | Vercel (frontend) + Railway (backend + database) | Vercel is purpose-built for deploying frontend apps straight from GitHub; Railway hosts backend and DB on one platform, so there's one dashboard and one place to manage secrets instead of two hosts' worth of quirks. |

Alternatives considered and why they lost, per decision, are in the conversation this plan came from — not duplicated here to keep this table scannable.

## Git workflow

**Starting Section 2:** one branch per section/task (e.g. `section-2-ui`, `fix-batch-validation`) → push → open a PR into `main` → self-review → merge.

Section 1 was built by committing straight to `main` — that's fine as-is, not worth retrofitting. Full git-flow (separate long-lived `dev`/`bugfix` branch tiers) was deliberately rejected: that taxonomy exists to coordinate multiple people and staged releases, neither of which applies to a solo project deploying straight from `main`. The lightweight feature-branch + PR loop still practices the real create-branch → push → PR → merge cycle, which is the actual interview-relevant skill.

## Build sections

Each section ends in something concretely visible working. No task-level breakdown yet — that comes later, per section, when it's time to build it.

1. **Project skeleton + a page renders**
   Initialize the Git repo, push to GitHub. Scaffold the React + Vite + TypeScript project.
   *Deliverable:* a blank Lead Scout page loads in the browser at localhost, and the code is committed and pushed to GitHub.

   - [x] 1.1 Initialize the local Git repo and make the first commit (the `learning/` docs).
   - [x] 1.2 Create a GitHub repo and push that first commit.
   - [x] 1.3 Scaffold the React + Vite + TypeScript app into `frontend/`.
   - [x] 1.4 Install dependencies and start the dev server — see the default Vite+React page at localhost.
   - [x] 1.5 Hand-edit the homepage to show "Lead Scout" instead of the default Vite content.
   - [x] 1.6 Commit and push the scaffolded frontend to GitHub.

2. **Static UI + interactivity, no backend yet**
   Build the real screens — batch input form, results table, company detail view — using fake/hardcoded data. Add styling and client-side interactivity (typing, clicking, switching views).
   *Deliverable:* the whole app's UI can be clicked through end to end on fake data, so the product's shape is visible before any backend exists.

3. **A simple local backend server**
   Stand up Express on Node, running locally, no database yet. One test route (e.g. a health check) called from the frontend.
   *Deliverable:* the frontend fetches from a real local server and displays the response — first real frontend-to-backend connection.

4. **Real API endpoints, still no persistence**
   Build the actual routes the frontend needs (create batch, get batch status, get results), backed by an in-memory store (a plain object/array) instead of a database yet. Wire the section 2 UI to these real endpoints instead of fake data.
   *Deliverable:* submitting a batch through the real UI hits a real API and gets a real response back — the frontend/backend contract works.

5. **Database + persistence**
   Set up Postgres locally, design the schema (users, companies, batch_runs, drafts), connect Express to it, swap the in-memory store from section 4 for real reads/writes.
   *Deliverable:* submit a batch, close the tab, reopen it — the data is still there.

6. **Authentication**
   Signup/login/session handling; scope data per logged-in user.
   *Deliverable:* create an account, log out, log back in, see only your own batches.

7. **The core AI pipeline (RAG) + background processing**
   Search/fetch real company info, chunk it, embed it into pgvector, retrieve the relevant pieces, generate the brief + email draft via an LLM. Run this as a background job so submitting a batch doesn't block the page.
   *Deliverable:* submit a real batch of real companies and get back real, grounded research briefs and email drafts, without the UI freezing.

8. **Tests**
   Write tests for the pieces that matter most: API endpoints, the retrieval logic, auth.
   *Deliverable:* a test suite that runs, passes, and catches a deliberately introduced bug.

9. **Live deployment**
   Deploy frontend to Vercel, backend + database to Railway. Wire up environment variables/secrets. Confirm the MVP guardrails (batch-size cap, per-user rate limit) are in place.
   *Deliverable:* a real public URL — a stranger (or you, on your phone) can open it, sign up, and run a batch end to end.

## End-of-project goal

Be able to explain how the app works end to end — what happens, in order, from pasting in a list of companies to receiving drafted emails — without needing to look anything up.
