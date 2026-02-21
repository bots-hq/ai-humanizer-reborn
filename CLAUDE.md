# CLAUDE.md — AI Humanizer Reborn

This file gives AI assistants the context needed to work effectively in this codebase.

## Project Overview

**AI Humanizer Reborn** is a single-page web application that transforms AI-generated text into natural, human-like content. Users paste AI text on the left, click a button, and receive a humanized version on the right, powered by the OpenAI GPT-4o-mini API via a Vercel serverless function.

## Architecture

```
Frontend (React SPA)  →  POST /api/humanize  →  Vercel Function  →  OpenAI API
```

- **Frontend:** React 18 + TypeScript SPA, built with Vite, styled with Tailwind CSS and shadcn/ui components
- **Backend:** A single Vercel serverless function (`api/humanize.js`) that proxies requests to OpenAI
- **No database or persistent storage** — all state is in React component memory
- **No authentication** — the app is publicly accessible; the OpenAI API key lives only on the server

## Directory Structure

```
/
├── api/
│   └── humanize.js          # Vercel serverless function (the entire backend)
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   └── ui/              # 49 shadcn/ui components (do not hand-edit these)
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Responsive breakpoint hook
│   │   └── use-toast.ts     # Toast notification hook
│   ├── lib/
│   │   └── utils.ts         # cn() utility (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Index.tsx        # Main UI — the entire application view
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Root: providers + router
│   ├── App.css
│   ├── index.css            # Tailwind directives + CSS custom properties (theme tokens)
│   └── main.tsx             # React DOM entry point
├── index.html               # HTML shell (Vite entry)
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── postcss.config.js
├── components.json          # shadcn/ui CLI config
├── vercel.json              # Vercel deployment config
└── package.json
```

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:8080
npm run build      # Production build → dist/
npm run build:dev  # Dev-mode build → dist/
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

The dev server binds to `::` (all interfaces) on port **8080**.

## Key Files to Understand First

| File | Purpose |
|---|---|
| `src/pages/Index.tsx` | All application logic and UI — start here |
| `api/humanize.js` | The complete backend (OpenAI proxy) |
| `src/App.tsx` | Provider tree and route definitions |
| `src/index.css` | CSS custom properties for the entire design system |
| `vercel.json` | Deployment and environment variable config |

## Environment Variables

| Variable | Where set | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | Vercel dashboard (secret `@openai-api-key`) | OpenAI API authentication |

For local development, create a `.env.local` file (gitignored) with:
```
OPENAI_API_KEY=sk-...
```

Vercel functions pick up `.env.local` automatically when using `vercel dev`. If running only `npm run dev` (Vite only), API calls to `/api/humanize` will fail unless you run the full Vercel dev environment.

## API Reference

### `POST /api/humanize`

**Request:**
```json
{ "inputText": "string — the AI-generated content to humanize" }
```

**Success response (200):**
```json
{ "humanizedText": "string — the humanized result" }
```

**Error responses:**
```json
{ "error": "descriptive error message" }
```
- `400` — missing or empty `inputText`
- `405` — wrong HTTP method
- `500` — missing API key, OpenAI API error, or unexpected exception

**Model config:** `gpt-4o-mini`, temperature `0.8`, max tokens `2000`

## Routing

Routes are defined in `src/App.tsx`. The comment `// ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE` marks the correct insertion point for new routes. The catch-all `*` renders `NotFound.tsx`.

## UI Component Conventions

### shadcn/ui components (`src/components/ui/`)
- Do **not** manually edit files in `src/components/ui/`. Add new components via the shadcn CLI:
  ```bash
  npx shadcn@latest add <component-name>
  ```
- All components are built on Radix UI primitives and styled with Tailwind CSS.

### Path aliases
Use `@/` as an alias for `src/`:
```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### Styling patterns
- Use `cn()` from `@/lib/utils` to merge Tailwind classes conditionally.
- Theme tokens are CSS custom properties defined in `src/index.css` (e.g. `--primary`, `--muted`, `--accent`). Reference them via Tailwind's semantic class names (`bg-primary`, `text-muted-foreground`, etc.).
- Dark mode is class-based (`dark` on `<html>`). The `next-themes` library manages the toggle.
- The color palette uses a slate base with purple/blue accent tones.

## State Management

There is no global state store. The app uses:
- **Local React state** (`useState`) for UI state (input text, output text, loading flag, copied flag)
- **React Query** (`@tanstack/react-query`) — installed and configured but not yet used for data fetching in the current codebase. It is available for future API calls.
- **React Hook Form + Zod** — installed but not currently used. Available for future forms.

## TypeScript Configuration

- Strict mode is **off** for app code (`tsconfig.app.json`). Avoid relying on this; write properly typed code.
- Target: ES2020 (app), ES2022 (node/tooling).
- Path alias `@/*` → `./src/*` configured in both `tsconfig.app.json` and `vite.config.ts`.
- The serverless function (`api/humanize.js`) is plain JavaScript — no TypeScript.

## Linting

ESLint is configured in `eslint.config.js` using the flat config format (ESLint 9+):
- **Applies to:** `**/*.{ts,tsx}`
- **Plugins:** `react-hooks` (enforced), `react-refresh` (warnings)
- **Notable rule:** `@typescript-eslint/no-unused-vars` is **off**
- **Ignored:** `dist/`

Run linting before committing:
```bash
npm run lint
```

There is no Prettier configuration. Keep formatting consistent with the existing code style.

## Deployment

The project deploys to **Vercel**:
- Vercel auto-detects the Vite framework and runs `npm run build`.
- The `api/` directory is treated as Vercel Serverless Functions automatically.
- `vercel.json` sets the function max duration to 30 seconds and wires the `OPENAI_API_KEY` secret.
- No Docker, no CI/CD pipeline is configured.

## Testing

There is **no test suite** configured. No Jest, Vitest, or testing library is installed. If adding tests, Vitest is the natural choice for this Vite-based project.

## Development Workflow Notes

1. **Adding a new page:** Create `src/pages/MyPage.tsx`, add a `<Route>` in `src/App.tsx` above the `*` catch-all.
2. **Adding a new shadcn/ui component:** Use `npx shadcn@latest add <name>` — do not create files in `src/components/ui/` by hand.
3. **Extending the API:** Add new files under `api/` — Vercel treats each file as a separate serverless function available at `/api/<filename>`.
4. **Modifying the humanization behavior:** Edit the `content` field of the `system` message in `api/humanize.js` and/or adjust `temperature` / `max_tokens`.
5. **The `lovable-tagger` plugin** runs only in development mode and is a Lovable platform integration — it can be ignored for non-Lovable workflows.

## Conventions to Follow

- Components are functional, using hooks — no class components.
- Each page component lives in `src/pages/`, each reusable UI component in `src/components/ui/` (shadcn) or a new `src/components/` subdirectory.
- Imports use the `@/` alias, not relative paths like `../../`.
- Toast notifications use the `useToast` hook from `@/hooks/use-toast` (shadcn toast) or the `sonner` `toast` import for simpler cases.
- Keep the serverless function stateless and side-effect free beyond the OpenAI API call.
- Do not commit `.env.local` or any file containing the API key.
