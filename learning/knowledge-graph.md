# Lead Scout — knowledge graph

The living map of what I actually know. Updated after every lesson. This file — not gut feel — decides what I get quizzed on.

## How this file works

- **Status ladder:** `seed` (not yet taught) → `introduced` (explained once) → `practicing` (used it, with help) → `understood` (explained in my own words *and* passed a check).
- Statuses only ever move up on evidence of something I actually said or did — never on assumption, and never because a topic "seems basic."
- Don't re-quiz anything currently `understood` with a recent last-reviewed date. Prioritize quizzing on `introduced` and `practicing` entries, oldest last-reviewed first.
- Every entry needs a one-line evidence field: what was actually said/done that justifies the status.
- Prior general experience (the CS degree, known languages) is background context, not evidence — status here reflects what's been demonstrated *in this project's tracked loop*, not what I already knew coming in. It'll move fast once touched, but starts honest.

---

## Low-level (variables, loops, functions)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Variables | seed | — | — | Not yet taught in-project. |
| Functions | seed | — | — | Not yet taught in-project. |
| Loops | seed | — | — | Not yet taught in-project. |
| Conditionals (if/else) | seed | — | — | Not yet taught in-project. |
| Data types (objects, arrays, primitives) | seed | — | — | Not yet taught in-project. |
| Async/await & Promises | seed | — | — | Not yet taught in-project. |
| TypeScript static typing | introduced | 2026-08-23 | 2026-08-23 | Claude explained type-checking as a reason to prefer TypeScript over plain JS during Decision 1; user's own explanation back didn't mention it. |

## Structural (files talking to each other, dependencies, package.json)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Modules / imports & exports | seed | — | — | Not yet taught in-project. |
| npm packages & dependencies | seed | — | — | Not yet taught in-project. |
| package.json | seed | — | — | Not yet taught in-project. |
| HTTP requests (fetch, request/response) | seed | — | — | Not yet taught in-project. |
| Frontend/backend separation (client-server model) | introduced | 2026-08-23 | 2026-08-23 | Explained via core components #2/#3, reinforced by the Next.js tradeoff discussion in Decision 3 — not yet restated by user. |
| REST API endpoints (routes & HTTP requests) | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #3 ("API = fixed menu of requests"); not yet restated by user. |
| Relational database & schema design | understood | 2026-08-23 | 2026-08-23 | User's Decision 4 explanation: "Postgres is a relational database which defines relationships between the data. The data that would be stored is very relational" — confirmed correct. |
| pgvector (embeddings stored in Postgres) | understood | 2026-08-23 | 2026-08-23 | User's Decision 4 explanation explicitly named it: "supports storing RAG pipeline needs so we don't need a vector database" — confirmed correct. |

## Engineering practice (git commits, testing, environment variables)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Git commits & version history | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #1; not yet restated by user or actually used (no repo initialized yet). |
| GitHub (remote repo hosting) | introduced | 2026-08-23 | 2026-08-23 | Same as above. |
| Environment variables & secrets | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #8 (secrets kept out of code that will be public on GitHub); not yet restated by user. |
| Authentication & sessions | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #5; not yet restated by user. |
| Background jobs / async processing | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #7; not yet restated by user. |
| Testing (unit tests) | seed | — | — | Named only as a build-plan deliverable (section 8); concept itself not yet explained. |
| Deployment & hosting (Vercel/Railway) | understood | 2026-08-23 | 2026-08-23 | User's Decision 5 explanation, confirmed correct: "Vercel is built for deploying frontend apps... Railway provides hosting for the backend and database so you don't need separate hosting for each." |

## AI-era practice (writing a good plan, reviewing a diff, agent memory files)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Retrieval-Augmented Generation (RAG), overall pattern | practicing | 2026-08-23 | 2026-08-23 | User's explanation collapsed the pipeline into "get company data → pass to LLM"; corrected that retrieval is a filtering step, not a pipe — attempted with help, not yet a clean pass. |
| Chunking (splitting text for retrieval) | introduced | 2026-08-23 | 2026-08-23 | Explained as part of the RAG breakdown; not mentioned in user's own explanation. |
| Embeddings (vector meaning representations) | introduced | 2026-08-23 | 2026-08-23 | Explained as part of the RAG breakdown; not mentioned in user's own explanation. |
| Retrieval (semantic filtering to relevant chunks) | introduced | 2026-08-23 | 2026-08-23 | The specific gap corrected in the user's RAG explanation — heard, not yet correctly restated. |
| Generation (LLM drafting from retrieved context) | practicing | 2026-08-23 | 2026-08-23 | User correctly described this piece: "passing it to an llm to draft an email." |
| Scoping & sequencing a build plan (MVP vs. v2, phased sections) | practicing | 2026-08-23 | 2026-08-23 | Jointly built the MVP/parking-lot split and the 9-section build plan; user engaged directly in the tradeoffs, not yet independently restated. |
| Agent memory / persistent context files (project.md, plan.md as living docs) | understood | 2026-08-23 | 2026-08-23 | User specified, unprompted, the exact mechanics wanted for this very file — status ladder, evidence fields, update triggers — demonstrating real grasp of the concept, not just use of it. |
| Reviewing a diff / code review | seed | — | — | No code exists yet to review. |

---

## Next quiz candidates (oldest/weakest first)

Everything above is dated today since this is the seed pass. Once lessons start, this section should list the `introduced`/`practicing` entries most overdue for a check — starting with **Retrieval** and **RAG overall** (the confirmed gap), then the `introduced`-only engineering-practice items (Git, environment variables, auth, background jobs) since those will become real once Section 1–3 of the build plan starts.
