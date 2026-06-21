# CLAUDE.md — Design 101

Agent context for Claude Code and deployed agents working on this project.

## What this is

Design 101 is a self-serve design training course for non-designers (engineers, PMs, cross-functional contributors). It teaches practical product design craft across 5 modules: See → Know → Why → Structure → Scale.

Live: https://design101.coscient.workers.dev
GitHub: https://github.com/czhengjuarez/design101
Owner: czhengjuarez / changying@coscient.com

---

## Stack

- **Runtime:** Cloudflare Workers (edge, no Node server)
- **Frontend:** React 18 + TypeScript + Vite 6
- **Design system:** Keel `--of-*` tokens (github.com/czhengjuarez/Keel)
- **AI:** Cloudflare Workers AI — `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
- **Storage:** R2 bucket `design101-data` (suggestions JSON)
- **Auth:** `passphrase` secret on the Worker (Cloudflare dashboard), checked via `X-Admin-Key` header

## Key commands

```bash
npm run dev          # Vite on :5173 (proxies /api → :8787)
npx wrangler dev --remote --port 8787  # Worker with live AI + R2
npm run build        # tsc + vite build → ./dist
npm run deploy       # build + wrangler deploy
```

---

## File map (what matters)

| File | Purpose |
|---|---|
| `src/data/modules.ts` | **All curriculum content.** 5 modules, typed. Edit here to change slides, resources, books, practice. |
| `worker/curriculum.js` | AI tutor grounding corpus. Keep in sync with modules.ts when slides change. |
| `frontend-worker.js` | The single Worker: serves SPA + handles all /api/* routes. |
| `wrangler.toml` | Worker config: R2 binding (DATA), AI binding, CATALOG_BASE var. |
| `src/styles/tokens.css` | Full Keel token set. Do not edit values — source from github.com/czhengjuarez/Keel. |
| `src/styles/global.css` | App styles built on tokens. |
| `src/components/DownloadCurriculum.tsx` | Client-side markdown export of a module's slides + resources + books. |
| `src/pages/Admin.tsx` | Passphrase-gated suggestion review panel. |

---

## Content model

All content is in `src/data/modules.ts`. The `Module` type:

```ts
interface Module {
  id: string           // kebab-case slug used in URL (/modules/:id)
  number: number
  title: string
  subtitle: string     // "How to See", "How to Know", etc.
  arc: string          // "See" | "Know" | "Why" | "Structure" | "Scale"
  description: string
  icon: 'eye' | 'search' | 'target' | 'boxes' | 'layers'
  color: string        // CSS var, e.g. 'var(--of-magenta-400)'
  slides: Slide[]
  resources: Resource[]
  books: BookSuggestion[]
  practice: ModulePractice  // { critique[], decisions[], tutorPrompts[] }
}
```

Slide types: `titleSlide`, `body`, `bullets`, `quote`, `highlight`, `split`, `image`, `link`. All optional; compose as needed.

---

## API routes

```
POST /api/ask                        AI tutor — { moduleId, question, history }
GET  /api/resources                  Catalog proxy (design-resources.coscient.workers.dev)
POST /api/suggestions                Submit suggestion → R2
GET  /api/admin/suggestions          List R2 suggestions [X-Admin-Key required]
PATCH /api/admin/suggestions/:id     Update status [X-Admin-Key required]
DELETE /api/admin/suggestions/:id    Delete [X-Admin-Key required]
```

---

## Agent use cases

### 1. Download / export curriculum

The `DownloadCurriculum` component in `src/components/DownloadCurriculum.tsx` converts a module's content to Markdown client-side. An agent can do the same server-side:

```js
// Fetch the module data and serialize to markdown
// GET /modules/:id → React page (SPA, not useful)
// Instead: read src/data/modules.ts directly and format
```

A deployed agent could:
- Pull `modules.ts` from the GitHub repo
- Serialize all 5 modules to a clean Markdown or PDF document
- Email or push to a Google Doc for teachers who want a printable curriculum

### 2. Content suggestion review agent

Triggered on a schedule or manually. Reads pending suggestions from R2 via the admin API, evaluates whether each suggestion fits the curriculum scope, and either auto-approves (adding to a staging branch of `modules.ts`) or flags for human review.

```bash
# List pending suggestions
curl https://design101.coscient.workers.dev/api/admin/suggestions \
  -H "X-Admin-Key: <passphrase>"
```

### 3. Curriculum update agent

Given a URL or article, an agent can:
- Fetch and summarize the content
- Determine which module it belongs to (See / Know / Why / Structure / Scale)
- Propose a new `Resource` or `BookSuggestion` entry formatted for `modules.ts`
- Open a PR on `github.com/czhengjuarez/design101`

### 4. New module drafter

An agent given a topic (e.g. "Motion Design" or "Data Visualization") can:
- Draft a new `Module` object following the existing content model
- Generate slides using the established patterns (overview → 3 deep-dives per concept)
- Add to `modules.ts` and open a PR

### 5. Tutor corpus sync

When `modules.ts` changes significantly, `worker/curriculum.js` needs updating. An agent can:
- Diff `modules.ts` against the last known state
- Extract updated slide content per module
- Rewrite the corresponding entry in `worker/curriculum.js`

---

## Things to be careful about

1. **String quotes in modules.ts** — All content strings must use proper JS quoting. Apostrophes inside single-quoted strings break TypeScript. Use double quotes for strings with contractions: `"Don't"`, `"it's"`, etc.

2. **tokens.css is read-only** — Values come from the Keel repo. If brand colors change, re-export from Keel rather than hand-editing values.

3. **curriculum.js must stay in sync** — The AI tutor answers from `curriculum.js`, not from `modules.ts` at runtime. When slides change substantially, update `worker/curriculum.js` too or the tutor will give outdated answers.

4. **R2 for suggestions, not D1** — The project has no D1 database. Suggestions are R2 JSON files. The migration in `migrations/` is a leftover stub — ignore it.

5. **Admin passphrase is a Worker secret** — Set in the Cloudflare dashboard as `passphrase` (encrypted). It is not in `wrangler.toml` or the repo. Never commit it.

6. **Workers AI model** — Currently `@cf/meta/llama-3.3-70b-instruct-fp8-fast`. If this model is deprecated, update the `AI_MODEL` constant at the top of `frontend-worker.js` and redeploy.
