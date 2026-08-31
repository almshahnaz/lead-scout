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
| Data types (objects, arrays, primitives) | practicing | 2026-08-26 | 2026-08-26 | Task 2.1: user wrote two object literals (an object with string/enum fields) as entries in a `CompanyResult[]` array, matching a given interface — used with a worked example as a guide. |
| Async/await & Promises | seed | — | — | Not yet taught in-project. |
| TypeScript static typing | understood | 2026-08-23 | 2026-08-30 | Task 2.1: user filled in two `CompanyResult` object literals matching a given interface, then correctly explained in their own words why `status: "done" \| "pending" \| "failed"` (a union type) is stricter than `string` — "it only allows those 3 statuses, anything else would result in an error." Task 2.5: hit a real `setResults` type error caused by string-literal widening (an untyped `notFound` object's `status: "pending"` widened to `string`, not the literal); when pointed back to how `fakeResults.ts` typed its object literals, independently applied the same `notFound: CompanyResult = {...}` annotation and it resolved the error — a genuine transfer of the technique to a new, subtler case. |
| Array methods for data transformation (`.filter()`, `.find()`, chaining) | practicing | 2026-08-30 | 2026-08-30 | Task 2.5: wrote the `.split("\n").map(trim).filter(...)` parsing pipeline correctly after one demonstration. First attempt at the matching step tried to jam a `.find()` call in as a second argument to the trim `.map()` instead of as its own separate `.map()` step; after the two-pipelines explanation, correctly wrote a second, standalone `.map()` containing `fakeResults.find((result) => result.companyName.toLowerCase().includes(name.toLowerCase()))`. |
| Ternary operator (`condition ? a : b`) | practicing | 2026-08-30 | 2026-08-30 | Task 2.5: after being shown the shape (as the two-sided version of the already-known `&&` conditional rendering), correctly wrote `return match ? match : notFound;` to supply a fallback `CompanyResult` when `.find()` returns `undefined`. |

## Structural (files talking to each other, dependencies, package.json)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Modules / imports & exports | practicing | 2026-08-26 | 2026-08-28 | Task 2.2: user wrote a real `import BatchInputForm from "./components/BatchInputForm"` themselves, correctly using default-import syntax (no curly braces) after it was distinguished from `fakeResults.ts`'s named-export style. |
| React components & JSX (editing existing markup) | practicing | 2026-08-24 | 2026-08-28 | Task 2.2: filled in a full controlled-form component (label/textarea/button, event handlers) from a skeleton, then correctly rendered it inside `App.tsx`. |
| React state (`useState`) & controlled inputs | practicing | 2026-08-28 | 2026-08-30 | Task 2.2: correctly filled `useState("")`, `setCompanyText(event.target.value)`, and `console.log(companyText)`. Initial verbal explanation had `onChange`/`onSubmit` timing backwards ("click sets companyText, then submit prints it"); after correction, correctly answered that typing "Acme" calls `setCompanyText` 4 times (once per keystroke) and 0 times on submit. Task 2.5: first attempt at a new `useState<CompanyResult[]>([])` call reached for `CompanyResult[] \| null` then a malformed `<CompanyResult[] \| []>` type; corrected after being pointed at the type-vs-value distinction to the right call unassisted. |
| Rendering lists with `.map()` and the `key` prop | practicing | 2026-08-28 | 2026-08-28 | Task 2.3: correctly keyed each `<tr>` with `result.id` on the first try; initially placed `{result.companyName}` as a direct child of `<tr>` instead of inside a `<td>` (invalid table markup that happened to still render) — corrected after the HTML-structure explanation, confirmed in the saved file. |
| Props & callback props (parent ↔ child communication) | practicing | 2026-08-28 | 2026-08-30 | Task 2.4: correctly wired `ResultsTable`'s `onClick={() => { onSelectResult(result); }}` on the first try. In `App.tsx`, initially wrote `onSelectResult={() => setSelectedResult(selectedResult)}` — a callback that declared no parameter, so the row's data passed in had nowhere to bind and the line was a no-op. After tracing through why (asked to predict clicking Initech would show Initech's data; predicted wrong), correctly identified the fix needed a parameter and fixed it to `(result) => setSelectedResult(result)`. Task 2.5: converting `ResultsTable` to take a `results` prop, twice wrote it as a second function parameter (`function ResultsTable({onSelectResult}: Props, {results}: Props)`) instead of one merged destructured object — corrected after being pointed at `CompanyDetail`'s single-parameter pattern. Independently wrote `BatchInputForm`'s new `onSubmit` prop (interface, destructuring, and call site) correctly on the first attempt. |
| Lifting state up (shared state in the common parent) | practicing | 2026-08-28 | 2026-08-30 | Task 2.4: `selectedResult` state was placed in `App.tsx` (the shared parent of `ResultsTable` and `CompanyDetail`) rather than in either child, following the explanation of why sibling components can't share state directly. Task 2.5: initially answered that new `results` state should live inside `ResultsTable` itself ("it only needs to show it"); after being asked which components need to *write* vs. *read* it, self-corrected to `App.tsx` and could state why (siblings can't hand data to each other directly). |
| Conditional rendering in JSX (`&&`) | practicing | 2026-08-28 | 2026-08-28 | Task 2.4: correctly added `{selectedResult && <CompanyDetail result={selectedResult} />}` in `App.tsx` on the first try; confirmed working by clicking between two different rows in the browser and watching the detail view switch. |
| `className` (linking JSX markup to CSS) | practicing | 2026-08-30 | 2026-08-30 | Task 2.6: after being told `class` is reserved in JS so JSX uses `className` instead, correctly added `className="company-detail"` to `CompanyDetail`'s wrapper `<div>` on the first try. |
| CSS layout & selectors (flexbox, `border-collapse`, `:hover`, custom properties) | introduced | 2026-08-30 | 2026-08-30 | Task 2.6: user asked the agent to write the styling pass directly rather than derive each property ("css isn't programming"); agreed to the offered middle ground (agent writes it, user pastes it into the file and still verifies/predicts). User correctly predicted the form would stack vertically and table rows would show a pointer cursor before checking the browser, and confirmed the result matched. Property-level authorship belongs to the agent here, not the learner — flagged `introduced` rather than `practicing` for honesty; revisit with a learner-authored styling task before calling this `practicing`. |
| npm packages & dependencies | practicing | 2026-08-24 | 2026-08-24 | Task 1.4: correctly predicted `npm install` would produce `package-lock.json` in addition to `node_modules`, and that `npm run dev` would keep running rather than return the prompt. Ran the real install, confirmed both files appeared. |
| package.json | introduced | 2026-08-24 | 2026-08-24 | Read the real generated file with user; walked through `scripts` and `dependencies`/`devDependencies` blocks as part of task 1.3. |
| package-lock.json (lockfiles & version pinning) | introduced | 2026-08-24 | 2026-08-24 | User predicted the file would appear but didn't know its purpose; explained it pins exact installed versions (vs. `package.json`'s loose ranges) for reproducibility, and that unlike `node_modules` it's committed to Git. |
| HTTP requests (fetch, request/response) | seed | — | — | Not yet taught in-project. |
| Frontend/backend separation (client-server model) | introduced | 2026-08-23 | 2026-08-23 | Explained via core components #2/#3, reinforced by the Next.js tradeoff discussion in Decision 3 — not yet restated by user. |
| REST API endpoints (routes & HTTP requests) | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #3 ("API = fixed menu of requests"); not yet restated by user. |
| Relational database & schema design | understood | 2026-08-23 | 2026-08-23 | User's Decision 4 explanation: "Postgres is a relational database which defines relationships between the data. The data that would be stored is very relational" — confirmed correct. |
| pgvector (embeddings stored in Postgres) | understood | 2026-08-23 | 2026-08-23 | User's Decision 4 explanation explicitly named it: "supports storing RAG pipeline needs so we don't need a vector database" — confirmed correct. |

## Engineering practice (git commits, testing, environment variables)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Git commits & version history | understood | 2026-08-23 | 2026-08-24 | Task 1.6: rejected Claude's proposed commit message and supplied their own ("Create React app with Vite") — shows real ownership of what a commit message should communicate, not just mechanical add/commit. |
| .gitignore (excluding files from version control) | understood | 2026-08-24 | 2026-08-24 | Task 1.6: user correctly predicted, in their own words, that `node_modules` would not be staged "because it is in the gitignore file so git will ignore that" — confirmed against real `git status` output showing it absent. |
| GitHub (remote repo hosting) | practicing | 2026-08-23 | 2026-08-30 | Task 1.2: repo created and pushed via `gh`. User pushed back on the private default with a real question, weighed the public-vs-private tradeoff against the project's portfolio goal, and chose public — engaged reasoning, not yet an unprompted explanation of remotes/push mechanics. Task 2.7: ran `git push -u origin feature/ui` themselves (first push of a brand-new branch) and correctly interpreted the resulting output; still hadn't independently restated why `-u`/tracking matters, so not yet `understood`. |
| Feature-branch → PR → merge workflow | practicing | 2026-08-30 | 2026-08-30 | Task 2.7: ran the full real cycle themselves for the first time in this project — `git push -u`, `gh pr create` (correctly predicted it would ask for a title, body, and target branch before running it), a real self-review of the PR diff on GitHub, and squash-merged via the GitHub website. |
| Merge strategies (merge commit vs. squash vs. rebase) | introduced | 2026-08-30 | 2026-08-30 | Task 2.7: agent explained the three options and recommended squash-and-merge; user accepted the recommendation ("i squashed and merged") without independently restating the reasoning — real usage, but not yet the user's own explanation. |
| Branch cleanup & squash-merge ancestry (`git branch -d` warnings) | practicing | 2026-08-30 | 2026-08-30 | Task 2.7: hit a real `git branch -d` warning ("not yet merged to HEAD") after a squash-merge; instead of panicking, ran `git log --oneline` and `git status` on request to check actual state, correctly reported both showing the squashed commit safely on `main` and a clean working tree — real evidence-based debugging, not just accepting reassurance. |
| Environment variables & secrets | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #8 (secrets kept out of code that will be public on GitHub); not yet restated by user. |
| Authentication & sessions | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #5; not yet restated by user. |
| Background jobs / async processing | introduced | 2026-08-23 | 2026-08-23 | Explained in core components #7; not yet restated by user. |
| Testing (unit tests) | seed | — | — | Named only as a build-plan deliverable (section 8); concept itself not yet explained. |
| Hot Module Reload / React Fast Refresh | practicing | 2026-08-24 | 2026-08-24 | Task 1.5: user predicted the counter's `useState` value would reset to 0 on a live edit; corrected — Fast Refresh preserves component state across edits. Ran a real test (clicked to 3, edited the file, count stayed 3) confirming the correction. |
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
