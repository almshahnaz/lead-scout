# Lead Scout — file map

Every file and folder in this project, one line each, so nothing in the repo is a mystery box.

**Status key:** `known` (explained in my own words) · `parked` (honest one-liner for now, deep dive scheduled) · `generated` (machine-made, never hand-edit).

| Path | What it is | Why it exists | Status |
|---|---|---|---|
| `lead-scout/` | Project root. | Everything for Lead Scout lives under here. | known |
| `lead-scout/learning/` | Folder holding the project's persistent planning/learning docs. | Read at the start of every session so context survives between sessions instead of getting re-derived. | known |
| `lead-scout/learning/project.md` | Who I am, the project idea and why it beat the alternatives, the MVP vs. v2 feature split, and the 8 core components. | The *what/why* record — read first, before any other file. | known |
| `lead-scout/learning/plan.md` | The five locked stack decisions (language, frontend, backend framework, database, hosting) and the 9-section build sequence with a concrete deliverable per section. | The *how* — turns the project.md idea into an ordered, checkable build path. | known |
| `lead-scout/learning/knowledge-graph.md` | Per-concept tracker (seed → introduced → practicing → understood) spanning low-level, structural, engineering-practice, and AI-era-practice concepts. | Drives what gets taught vs. quizzed next; prevents re-teaching what's already understood and re-testing what's already fresh. | known |
| `lead-scout/learning/file-map.md` | This file. | So every file in the repo has a stated purpose the moment it's added — nothing accumulates unexplained. | known |

Nothing generated yet — no code exists. Once Section 1 of `plan.md` starts (repo init + Vite scaffold), this file gets new rows immediately: things like `package.json` and `package-lock.json` as `generated`, and each hand-written source file added as `known` (or `parked` if it's created faster than it's understood — the honest label for "I'll come back to this").
