# Design 101 — Design Training for Non-Designers

A self-serve course site teaching engineers, PMs, and cross-functional contributors the practical craft of product design. Not to make them designers — to give them the vocabulary and judgment to ship UI with good taste, and the instinct to know when a decision needs a designer.

**Live:** https://design101.coscient.workers.dev

---

## What it teaches

Five modules following the arc **See → Know → Why → Structure → Scale**:

| # | Module | Outcome |
|---|--------|---------|
| 1 | Design Craft | Read and critique design with vocabulary and reasoning |
| 2 | User-Centered Design | Ground decisions in user evidence; navigate ambiguity |
| 3 | Jobs To Be Done | Identify the real job; evaluate designs against it |
| 4 | OOUX | Map product structure; surface object-model conflicts early |
| 5 | Design Systems | Work within a system correctly; know when it must evolve |

Each module has **slides** (27–18 slides), **resources**, **books** with covers, **practice exercises** (critique + decision drills), and an **AI tutor** grounded in the curriculum.

## How practice works

No deliverables, no submissions. Three formats:

- **Critique / spot the issue** — prompts against your own product; reveal what to look for
- **When to call a designer** — ship-it / fix-yourself / escalate scenario drills with rationale
- **Ask the Tutor** — Workers AI Socratic tutor scoped to the active module

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite 6, React Router v6 |
| Styling | **Keel** `--of-*` design tokens — `github.com/czhengjuarez/Keel` |
| Backend | Single Cloudflare Worker (`frontend-worker.js`) — serves SPA + all API routes |
| AI tutor | **Cloudflare Workers AI** — `@cf/meta/llama-3.3-70b-instruct-fp8-fast` |
| Community + Suggestions | **R2** (`design101-data` bucket) — JSON + binary, no schema |
| Content | Typed `src/data/modules.ts` — no CMS, version-controlled |
| Deployment | Cloudflare Workers (account: ChangyingArts) |

---

## Project structure

```
design101/
├── frontend-worker.js      # Edge Worker: SPA serving + all API routes
├── worker/
│   └── curriculum.js       # AI tutor grounding corpus (server-side, mirrors modules.ts)
├── src/
│   ├── data/
│   │   └── modules.ts      # All curriculum content — 5 modules, typed
│   ├── components/
│   │   ├── Layout.tsx            # Sidebar nav + theme toggle
│   │   ├── SlideDeck.tsx         # Keyboard + fullscreen slide viewer
│   │   ├── CritiqueExercise.tsx  # "Spot the issue" reveal component
│   │   ├── DecisionDrill.tsx     # Ship/fix/escalate judgment drill
│   │   ├── AskTutor.tsx          # Workers AI chat panel
│   │   └── DownloadCurriculum.tsx  # Client-side markdown export
│   ├── pages/
│   │   ├── Home.tsx         # Module grid + teaching philosophy
│   │   ├── ModulePage.tsx   # Tabbed module view + prev/next nav
│   │   ├── Community.tsx    # Gallery of community teaching posts
│   │   ├── Share.tsx        # Submit a teaching post (image + description)
│   │   ├── Suggest.tsx      # Suggest a resource for a module
│   │   ├── Admin.tsx        # Passphrase-gated suggestions + community moderation
│   │   └── About.tsx        # Course philosophy
│   └── styles/
│       ├── tokens.css       # Keel --of-* design tokens (full set)
│       └── global.css       # App styles built on tokens
├── public/
│   └── favicon.svg          # Lucide book-open icon, Keel magenta gradient
└── wrangler.toml
```

---

## API routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/ask` | public | AI tutor. Body: `{ moduleId, question, history }` → `{ answer, citations }` |
| `GET` | `/api/resources` | public | Cached proxy of design-resources catalog |
| `POST` | `/api/community` | public | Submit a community post (multipart: image + metadata) → R2 |
| `GET` | `/api/community` | public | List all community posts (metadata only) |
| `GET` | `/api/community/:id/image` | public | Serve a community post image from R2 |
| `DELETE` | `/api/admin/community/:id` | `X-Admin-Key` | Delete a community post |
| `POST` | `/api/suggestions` | public | Submit a resource suggestion → R2 |
| `GET` | `/api/admin/suggestions` | `X-Admin-Key` | List all suggestions from R2 |
| `PATCH` | `/api/admin/suggestions/:id` | `X-Admin-Key` | Update suggestion status |
| `DELETE` | `/api/admin/suggestions/:id` | `X-Admin-Key` | Delete a suggestion |

Admin routes require an `X-Admin-Key` header matching the `passphrase` secret set in the Cloudflare dashboard.

---

## Develop locally

```bash
npm install
npm run dev          # Vite dev server on :5173 — proxies /api → :8787
npm run dev:worker   # Worker (AI + suggestions) on :8787 — run in a second terminal
```

> The AI tutor and suggestion submission need the Worker running with `--remote` to access Workers AI and R2:
> ```bash
> npx wrangler dev --remote --port 8787
> ```

## Deploy

```bash
npm run deploy       # runs: tsc -b && vite build && wrangler deploy
```

Assets are content-addressed — browser cache busts automatically on every deploy.

---

## Content model

All curriculum lives in [`src/data/modules.ts`](src/data/modules.ts). To add or edit content, edit that file and run `npm run deploy`. No CMS, no database — the content is the source of truth.

The AI tutor's grounding corpus in [`worker/curriculum.js`](worker/curriculum.js) must be kept in sync with `modules.ts` manually when slides change significantly.

### Adding a resource or book to a module

Find the module in `src/data/modules.ts` and add to its `resources[]` or `books[]` array:

```ts
// In the relevant module object:
resources: [
  {
    title: 'Your resource title',
    url: 'https://...',
    type: 'article', // article | video | podcast | book | tool | framework | course
    description: 'One sentence on why this is useful.',
  },
],
books: [
  {
    title: 'Book Title',
    author: 'Author Name',
    url: 'https://...',
    thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/ISBN-L.jpg', // optional
    note: 'One sentence on what makes it worth reading.',
    topPick: true, // optional
  },
],
```

---

## Community space

The `/community` page is an open gallery for anyone who has taught — or is teaching — design craft to non-designers. Posts are not limited to this curriculum; anyone sharing the practice is welcome.

### Submitting a post (`/share`)

- **Image** — drag-and-drop, click to browse, or paste directly from clipboard (`Cmd+V`)
- **Title** — what you taught or the context (required)
- **Description** — what happened, what worked, what surprised you (required)
- **Name + contact** — optional; if provided, a "Get in touch" link appears on the card so others can reach the author

Each post writes two R2 objects to `design101-data`:
- `community/{id}/meta.json` — title, description, name, contact, timestamp
- `community/{id}/image` — binary image served with immutable cache headers

Posts are open — no approval step. Admins can delete from `/admin` if needed.

---

## Suggestions workflow

Community members suggest resources at `/suggest`. Each submission writes a JSON file to R2 (`design101-data` bucket, `suggestions/` prefix). The admin reviews at `/admin` (passphrase: set in Cloudflare dashboard as the `passphrase` secret). Approved suggestions are manually added to `modules.ts`.

---

## Design system

Built on **Keel** (`github.com/czhengjuarez/Keel`) — the same `--of-*` token system used by LBD and other Coscient projects. Tokens cover color (magenta brand + gray ramp + semantic), type (Space Grotesk display, Inter body, JetBrains Mono), spacing, radius, shadow, and motion. Full token list in [`src/styles/tokens.css`](src/styles/tokens.css).

Light/dark mode is driven by `color-scheme` + `light-dark()` CSS — no JS class toggling required. The theme toggle writes `data-theme` to `<html>` and persists to `localStorage`.
