# Design 101 — Planning Doc

**Working title:** Design 101 — *Design Training for Non-Designers*
**Status:** Planning → scaffolding
**Owner:** czhengjuarez
**Last updated:** 2026-06-20

---

## 1. What this is

A self-serve learning site that teaches **non-designers** (engineers, PMs, cross-functional
contributors) the *practical craft* of product design — enough judgment to ship low-impact UI
with good taste, follow design principles, and **know when to escalate to a designer**.

It is modeled structurally on **LBD ("Leadership by Design"**, `~/Repo/lbd`) — same stack,
same `--of-*` design system — but with three deliberate differences:

1. **No deliverables / no submission gallery.** Learners are practitioners, not students building
   portfolios. We train *judgment*, not artifacts.
2. **Practice = self-check, not submit.** Three interactive formats (below) replace assignments.
3. **An AI tutor** ("Ask the Tutor") per module, grounded in our curriculum + a curated catalog.

### Teaching north star (from the philosophy doc)
> Quality shouldn't be gated by design review — it should be *distributed* via shared language,
> training, and tools. "Taste is a trained rubric, and we can teach it."

Everything on the site serves that: build the rubric, train the eye, teach the escalation call.

---

## 2. Audience & outcomes

**Audience:** Engineers, PMs, cross-functional contributors who ship product UI.
**Not covered:** design leadership, team dynamics, careers. Only soft skill: navigating ambiguity.

**Per-module outcome** (the "Arc": See → Know → Why → Structure → Scale):

| # | Module | Arc | Outcome |
|---|--------|-----|---------|
| 1 | Design Craft | How to **See** | Read & critique design with vocabulary + reasoning |
| 2 | User-Centered Design | How to **Know** | Ground decisions in evidence; decide when evidence is incomplete |
| 3 | Jobs To Be Done | How to think in **Whys** | Identify the real job; evaluate designs against it |
| 4 | OOUX | How to **Structure** | Map product structure; surface object-model conflicts early |
| 5 | Design Systems | How to **Scale** | Work within a system correctly; know when it must evolve |

---

## 3. Decisions (locked)

| Decision | Choice | Why |
|---|---|---|
| **Stack** | Cloudflare Worker + React 18 + Vite 6 + TS | Match LBD; single edge deploy |
| **Design system** | **Keel** `--of-*` tokens (`github.com/czhengjuarez/Keel`) | Same system LBD uses; magenta brand |
| **AI** | **Cloudflare Workers AI** (`env.AI`) | No per-call API cost; runs at edge |
| **AI corpus** | Closed: curriculum text + curated catalog (NOT open web in v1) | On-message, cheap, low hallucination |
| **Practice formats** | Critique exercises · "When to call a designer" drills · AI Socratic Q&A | Train judgment, no submission |
| **Module locking** | **Removed** | Always-open self-serve, not a cohort |
| **Admin** | **Scaffolded, not active** — profile + content-suggestions flow planned for later | Future content management |
| **Content storage** | Typed `src/data/modules.ts` (no CMS) | Match LBD; version-controlled content |
| **Favicon** | Lucide learning icon (book), brand magenta | Signals "learning" |

---

## 4. Architecture

```
Browser ──► Cloudflare Worker (frontend-worker.js)
              ├─ serves React SPA (static assets via [site] bucket = ./dist)
              └─ /api/* routes:
                   POST /api/ask            → Workers AI tutor (env.AI)
                   GET  /api/resources      → cached proxy of design-resources catalog
                   POST /api/suggestions    → store a content suggestion (D1)   [future-facing]
                   GET  /api/admin/*         → admin (scaffold, auth-gated)      [future]
            │
            ├─ env.AI            Workers AI binding (text generation)
            ├─ env.DB           D1: suggestions (+ future admin tables)
            └─ env.CATALOG_KV   KV: cached design-resources catalog (optional)
```

Single Worker serves both API and SPA, same as LBD. No separate server.

### Content model (`src/data/modules.ts`)
Extends LBD's `Module` type. Drops `submissions`; adds practice sub-types:

```ts
interface Module {
  id, number, title, subtitle, description, icon, color,
  slides:    Slide[]            // teaching content (SlideDeck viewer)
  resources: Resource[]         // curated links per module
  books:     BookSuggestion[]   // seeded from catalog Books category
  practice:  ModulePractice     // { critique[], decisions[], tutorPrompts[] }
}

interface CritiqueExercise {        // "spot the issue"
  image: string                     // UI screenshot
  prompt: string
  issues: { label: string; note: string }[]   // revealed after attempt
}

interface DecisionDrill {           // "when to call a designer"
  scenario: string
  choice: 'ship' | 'fix-yourself' | 'escalate'   // correct answer
  rationale: string
  options?: string[]
}
```

---

## 5. The three practice formats (replacing assignments)

### A. Critique / "spot the issue"
Real UI screenshot + prompt. Learner mentally identifies problems, then reveals the annotated
issues (hierarchy, spacing, contrast, type). **No submission** — instant self-check. Trains "how to see."

### B. "When to call a designer" decision drills
Scenario card → learner picks **ship-it / fix-yourself / escalate** → reveals correct call + rationale.
This is the judgment the teaching doc centers on: ship low-impact with taste, escalate high-impact.

### C. AI Socratic Q&A per module ("Ask the Tutor")
Embedded chat on each ModulePage. Workers AI answers grounded in:
1. **The active module's curriculum** (passed in the system prompt — small, authoritative).
2. **The curated catalog** (matched links/books surfaced as "further reading").
Socratic tone: asks clarifying questions, pushes the learner to reason, cites the lesson.

---

## 6. AI Q&A design (the part to get right)

**Problem:** the design-resources site is *just links* — RAG over it retrieves titles, not content.

**Solution — closed-corpus, two layers:**
- **Answer from** the curriculum (we own it; small; on-message). Scope to the active module.
- **Cite from** the catalog: pull `design-resources.coscient.workers.dev/api/resources` +
  `/api/categories`, cache it (KV/D1), keyword-match to surface 2–3 relevant links/books.
- **No open web search in v1.** Optional later: constrained fetch of a *specific* resource URL.

**No Vectorize/embeddings in v1** — curriculum is a few thousand tokens; pass it directly + keyword
filter the catalog. Add Vectorize only if the corpus grows or cross-module recall needs it.

**Model:** Workers AI text model (e.g. `@cf/meta/llama-3.3-70b-instruct` or current best instruct
model). System prompt = teaching philosophy + active module text + matched catalog entries.

**Guardrails:** stay within design-craft scope; when unsure, say so and point to a resource;
encourage escalation to a real designer for high-impact decisions.

---

## 7. Admin & content-suggestions (FUTURE — scaffold only)

Not built in v1 beyond stubs. Planned shape:

- **Suggest content** (public): a small form → `POST /api/suggestions` → D1 `suggestions` table
  (`title, url, category, note, submitter, status='pending'`). Mirrors the design-resources
  "suggest a resource" flow.
- **Admin profile** (later): auth-gated (`X-Admin-Key` like LBD, or Cloudflare Access) to review
  suggestions (approve/reject), and eventually edit resources/books. Keep the route namespace
  `/api/admin/*` reserved now so we don't refactor later.
- **Why now:** reserve the data model + routes so adding management later is additive, not a rewrite.

---

## 8. Reuse from LBD vs. new

| Reuse (copy + adapt) | Build new |
|---|---|
| Stack, `wrangler.toml`, Vite/TS config | `modules.ts` content (5 design modules) |
| Keel `--of-*` design system CSS | `AskTutor` (Workers AI chat) |
| `SlideDeck`, `Layout`, `CourseIcon` | `CritiqueExercise` component |
| Worker SPA-serving shell | `DecisionDrill` component |
| Home / ModulePage shells | `/api/ask` + catalog proxy + suggestions |
| — | Lucide book favicon |
| Drop: submissions, gallery, module-lock, schedule | Admin/suggestions scaffold |

---

## 9. Build phases

1. **Scaffold + design system** — configs, Keel tokens, app shell, favicon. *(this pass)*
2. **Curriculum content** — Module 1 fully authored; 2–5 stubbed from the curriculum doc.
3. **Practice components** — SlideDeck, CritiqueExercise, DecisionDrill, AskTutor.
4. **AI backend** — `/api/ask` (Workers AI) + catalog cache + suggestions stub.
5. **Polish + deploy** — Home, About, responsive, deploy to `*.coscient.workers.dev`.

## 10. Open items
- Final Workers AI model id (verify current best instruct model at build time).
- Source UI screenshots for critique exercises (or use neutral mockups).
- Confirm deploy name (`design101` ?) + whether to set up D1/KV now or at AI-backend phase.
