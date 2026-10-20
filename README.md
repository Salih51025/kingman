# Wish Battle

A small interactive 2D cartoon fantasy scene. A knight arrives, plants a sword, and fights a short scripted battle based on the wish you type.

The first version uses **local rule-based matching**, not AI. It does not grant real-world wishes.

The interface defaults to Turkish and can be switched to English with the **TR | EN** control. The selected language is remembered in `localStorage`. Switching language does not restart the intro or the current battle. Wish matching still understands both Turkish and English keywords regardless of the UI language.

## Stack

- Frontend: React, Vite, JavaScript, CSS
- Optional backend: Node.js and Express
- Shared battle rules live in `shared/` so the static site and the API use the same classifier

## Local setup

```bash
npm install
```

### Frontend

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

The game works without the backend. Battle selection runs in the browser.

### Optional Express API

Copy `.env.example` to `.env` if you want custom ports or CORS.

```bash
npm run dev:server
```

Health check: `GET http://localhost:8787/api/health`

If the frontend should call the API, start Vite with:

```bash
npx vite
```

and set `VITE_API_URL=http://localhost:8787` in `.env`. If the API is unreachable, the client falls back to the shared local rules.

### Tests

```bash
npm test
```

### Production frontend build

```bash
npm run build
npm run preview
```

## Deployment

GitHub Pages can host the **static frontend only**. It cannot run Express.

1. Create a public GitHub repository and push this project.
2. In the repository, enable **GitHub Pages** with **GitHub Actions** as the source.
3. Push to `main`. The workflow in `.github/workflows/pages.yml` builds `dist` and deploys it.

Vite `base` is `/` by default. In GitHub Actions it becomes `/<repo-name>/` for project sites, or `/` for `username.github.io` user sites. Override with `VITE_BASE` when using a custom domain.

To host the optional API, deploy `server/index.js` on any Node host (Render, Fly, a VPS). Point `VITE_API_URL` at that origin when you build. Do not expect the API to run on GitHub Pages.

## Developer wish dashboard

Wishes are stored only when the Express API is running. They are written to a server-side JSON file (`data/wishes.json` by default). This is not `localStorage` and it does not run on GitHub Pages.

1. Copy `.env.example` to `.env`.
2. Set `ADMIN_PASSWORD` and `SESSION_SECRET` on the **server**. Do not put them in `VITE_*` variables.
3. Start the API with `npm run dev:server`.
4. Start the frontend with `VITE_API_URL=http://localhost:8787`.
5. Open `/developer/wishes` or `/#/developer/wishes`.
6. Sign in with the admin password. The session cookie is HttpOnly and validated on the server.

Public players can only create a wish. Listing and deleting records require the admin session. GitHub Pages can still host the game; remote storage starts only after the API is deployed with those server secrets.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite frontend |
| `npm run dev:server` | Express API |
| `npm test` | Classifier and validation tests |
| `npm run build` | Static production build |
| `npm start` | Express API (same as `dev:server`) |
