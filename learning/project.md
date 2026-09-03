# Lead Scout — project log

Read this file at the start of every session on this project.

## Who I am

- CS degree. Know Java, JavaScript, Python, HTML, CSS. Comfortable with OOP and syntax across languages.
- Node.js experience, React basics, SQL basics.
- Have built projects before, but leaned too heavily on AI-generated code or tutorials — didn't retain much, and get stuck not knowing where to start when building from scratch without a guide.
- Currently job hunting for SWE roles, primarily at startups.
- Longer-term goal: break into AI engineering. Want this project to include a real AI/RAG element, not a bolted-on LLM call, as genuine skill demonstration.
- Explicit goal for this project: learn to code for real — understand and retain what's built, not just produce a working demo.

## The idea

Lead Scout: take a batch of company names or domains and turn each one into a research brief plus a drafted cold outreach email — automating the "look up the company, find an angle, write a personalized opener" work that eats hours of manual outbound.

Chosen over two alternatives considered:
- A web-based cold-calling tool (WebRTC + Twilio) — rejected as MVP-worthy: it's telephony infra more than AI/data work, costs real money to test, carries TCPA/robocall compliance risk, and has no visible-early milestone (nothing demoable until the mic-to-PSTN pipeline fully works).
- Ranked against "Feedback Radar" (feedback clustering) and a generic RAG-docs-chatbot idea — Lead Scout won on strongest business ROI story, most natural full-stack surface area, and least "seen it a thousand times" AI angle.

Target user: startup/SDR doing manual outbound prospecting.

## MVP — the smallest version that's genuinely useful, live on the internet

1. Batch input — paste or upload a CSV of company names/domains. Batch size capped (e.g. 15) as a cost/failure guardrail, not permanent.
2. Real per-company research — search API + fetch static HTML from company site/news. No headless browser, no JS rendering.
3. Actual RAG — chunk retrieved text, embed it, store embeddings in pgvector (same Postgres, no separate vector DB service), retrieve top-k relevant chunks for generation.
4. Grounded generation — LLM writes a research brief + cold email draft, citing which retrieved chunk it drew from. Not raw prompt-stuffing.
5. Simple background processing — sequential worker so a batch doesn't block the HTTP request. No queue infrastructure yet.
6. Postgres — companies, batch runs, chunks/embeddings, drafts.
7. Real auth — signup/login/logout, sessions, single-tenant per user. Doubles as portfolio-required "auth" skill and as cost protection for the public deployment.
8. Minimal frontend — submit a batch, see run status, view results table, open a company for brief + editable draft text, export batch as CSV.
9. Actually deployed — frontend, backend, worker, DB all hosted (not localhost). Secrets in env vars. Batch-size cap and basic per-user rate limit so it survives being public.

## Parking lot (v2) — deliberately deferred, not forgotten

- Headless-browser scraping (Playwright) for JS-heavy/anti-bot sites
- Real job queue (Redis/BullMQ) with retries, concurrency, live progress
- Direct email sending via Gmail/Outlook OAuth
- CRM integrations (HubSpot, Salesforce, Airtable sync)
- Regenerate-with-instructions, tone/persona options, multiple draft variants
- Teams/orgs, roles, shared lists
- Password reset, email verification, SSO
- Analytics dashboard (reply rates, campaign stats)
- Multi-LLM provider support
- Usage-based billing/plans
- Bulk batches (100s–1000s of companies) with real cost controls
- Retrieval evaluation harness (precision/recall on retrieval quality)
- Real-time progress via websockets
- Saved/searchable lead lists across past runs
- Notifications when a batch finishes

## Core components (build roadmap)

The major pieces needed to build and deploy this end to end, roughly in the order they get built:

1. **Source control (Git + GitHub)** — Git saves snapshots ("commits") of the code as it changes, giving a history to fall back on. GitHub hosts that history online and is how the work gets shown to others. Set up before any code, so every other piece has a safety net from day one.
2. **Frontend** — the actual web page (forms, buttons, results table), built with HTML/CSS/JavaScript via React (a library for building pages out of reusable pieces called components). The only piece a human directly touches.
3. **Backend / API server** — a program that runs continuously on a server (an always-on computer that isn't the laptop) and does the real work: receives requests, decides what to do, talks to the database and outside services. "API" = the fixed menu of requests the frontend is allowed to send it. Keeps secrets and logic off the browser.
4. **Database (Postgres)** — storage that survives after a program stops, unlike in-memory data which vanishes on restart. Needed to remember companies, runs, and drafts across sessions/logins.
5. **Authentication** — login system: checks identity, then tracks "logged in" via a session (a proof-of-login token the browser holds). Needed both as the portfolio-required auth skill and as protection against strangers burning paid API budget once the app is public.
6. **The AI pipeline (RAG)** — the core product logic: search/fetch real facts about a company → chunking (cut text into small pieces) → embeddings (turn each piece into a comparable "meaning fingerprint") → retrieval (filter down to the pieces actually relevant to what's being written) → generation (hand those to an LLM to draft the brief/email). Retrieval is a genuine filtering step, not just a pipe from source text to LLM — dumping a whole scraped page into the prompt is prompt-stuffing, not RAG. This is the specific AI skill the project exists to demonstrate.
7. **Background job processing** — hands a slow batch of research off to run separately from the request, so the page shows "in progress" instead of freezing. Needed so batches don't time out or lock the UI.
8. **Deployment / hosting** — moving code off the laptop onto always-on servers reachable at a public address (separate hosts for frontend, backend, database), with secrets (API keys) stored as environment variables so they never get written into code that will sit publicly on GitHub.

## Decisions worth remembering

- Auto-sending emails was explicitly rejected for MVP and v2 consideration is not a given — deliverability/spam liability. Product is a draft a human sends, not an auto-sender.
- CRM sync was cut from MVP despite feeling "business-oriented" — CSV export proves the same integration-readiness without OAuth complexity.

## Progress log

- **2026-08-30 (task 2.5):** Wired `BatchInputForm`'s submit to actually populate `ResultsTable`, still against fake data. `results` state now lives in `App.tsx` (lifted so both the form and the table can reach it); submitting parses the textarea into names and matches each against `fakeResults` with a case-insensitive substring check, falling back to a "pending, no data" placeholder for unmatched names. Along the way: hit and fixed a real TypeScript string-literal-widening error on the fallback object (fixed the same way `fakeResults.ts` types its entries — an explicit `: CompanyResult` annotation).
- **2026-08-30 (task 2.6):** Basic styling pass. Cleared the dead Vite scaffold CSS out of `App.css` and replaced it with real rules for the form (flexbox stacking), the results table (borders, `border-collapse`, row hover highlight), and a new `.company-detail` card style. User asked the agent to drive the CSS directly rather than derive each property ("CSS isn't programming") — agreed compromise: agent writes it, user pastes it in, still predicts/verifies the result rather than a blind handoff.
- **2026-08-30 (task 2.7):** Section 2 fully shipped via the real feature-branch → PR → merge workflow for the first time in this project. Decided to commit `.claude/` to the public repo rather than gitignore it (harmless lesson-runner config, not worth hiding). Committed all of tasks 2.1–2.6 as one commit ("Build static UI"), pushed `feature/ui` with `git push -u`, opened PR #1 via `gh pr create`, self-reviewed the diff, squash-merged on GitHub, and cleaned up both the remote and local `feature/ui` branches. Hit (and correctly diagnosed via `git log`/`git status`, not panic) a `git branch -d` warning caused by squash-merge changing commit ancestry — a real, common git gotcha, not an actual problem.
- **2026-08-31 (task 3.1):** Started Section 3 (local backend server). Broke it into 6 tasks in `plan.md`. Scaffolded `backend/` as its own npm project, sibling to `frontend/`: `npm init -y`, installed `express` as a runtime dependency and `typescript`/`@types/node`/`@types/express`/`tsx` as dev dependencies, generated `tsconfig.json` via `npx tsc --init` and hand-edited `types: []` to `types: ["node"]`, and added a `dev` script (`tsx watch server.ts`) that will work once `server.ts` exists next lesson. Caught and fixed a real gap before it became a problem: `backend/` had no `.gitignore`, so `node_modules` was about to be committable; user predicted this correctly when asked, then added `backend/.gitignore` and verified the fix with `git status --untracked-files=all`. No server code written yet — that's task 3.2.
- **2026-09-03 (tasks 3.2–3.4):** Wrote the first real running server in this project. User wrote all of `server.ts` unassisted after each piece (app instance, route, listen) was explained separately — correct on the first pass. Ran it, predicted and confirmed the startup log, then predicted and confirmed the browser response at `/health`. Added CORS: user's first two predictions about what breaks without it were both wrong (guessed a 404, then guessed the browser blocks the request pre-send) — corrected both times, real gap, not yet independently restated correctly, worth a review pass later in Section 4 when the frontend actually calls this endpoint. Installed `cors` + `@types/cors`, added `app.use(cors())`. Side quest: user independently changed `backend/package.json`'s `"type"` from `"commonjs"` to `"module"` on their own initiative (reasoning was partially off — corrected); confirmed the server still ran fine afterward. Stopped before task 3.5 (wiring the frontend to call `/health`) since it's a new kind of work — the first `useEffect` — and deserved its own session rather than being rushed in.
- **2026-09-03 (task 3.5, same day):** Before continuing, created a feature branch (`backend-setup`, user's own name choice) for all of Section 3's uncommitted work — correcting a process gap, since the git workflow calls for a branch starting Section 2 and the prior session had (wrongly) suggested committing tasks 3.2–3.4 straight to `main`. Then wired the frontend to `/health`: taught `useEffect`, Promises/`async`/`await`, and `fetch` together. User wrote the state, the async fetch/parse logic, and the conditional render themselves; initially omitted the `useEffect` dependency array (a live instance of a misconception just corrected moments earlier in a prediction question) but self-caught and fixed it unassisted. Confirmed working in the browser: the real string `"ok"`, fetched live from the Express server, rendered on the page — Section 3's deliverable (a real frontend-to-backend connection) reached. Following the section-2 precedent, held off on committing until the whole section (task 3.6: commit + push + PR + merge) is ready to go as one unit.
