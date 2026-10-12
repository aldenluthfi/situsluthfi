# Archive

Frozen frontends of [aldenluth.fi](https://aldenluth.fi). Each `vN/` is the complete
frontend as it shipped, kept installable and buildable so past versions can still be
run, screenshotted, or embedded — not just read.

The live frontend always lives at `/frontend`. The backend is shared and is never
archived.

## Versions

| Folder | Label | Served at | Stack | Run |
|--------|-------|-----------|-------|-----|
| [v1](./v1) | vI (2026) | `/archive/vI/` | React 19 · Vite 6 · Tailwind v4 · TypeScript, SPA with `react-router-dom` | `cd archive/v1 && npm ci && npm run dev` |

The live frontend (`/frontend`) is vII (2027). Its `/archive` page lists every version
and links to each one's served build.

v1 highlights: hand-rolled 17-hue theme system that rotates with the time of day,
custom cursor, Notion-backed writings, GitHub-backed project stack, LaTeX CV export,
⌘K search over Elasticsearch.

## Running an archived version

```sh
cd archive/vN
npm ci
npm run dev        # or: npm run build
```

Versions that fetch data need the backend on `localhost:3000` — start it with
`npm run dev:backend` from the repo root. Each version's `vite.config.ts` already
proxies `/api` there.

Every `vN/` also keeps its own `Dockerfile` and `nginx.conf`, so it can be built and
served standalone:

```sh
docker build -t situsluthfi-vN ./archive/vN && docker run -p 8081:8080 situsluthfi-vN
```

## Conventions

- **Self-contained.** A version folder keeps its own `package.json`, `package-lock.json`,
  `tsconfig*`, `eslint.config.ts`, `Dockerfile`, `nginx.conf`, and assets. It never
  reaches outside itself.
- **Verbatim.** Archived code is not refactored, relinted, or dependency-bumped. It is
  a record of what shipped. The one allowed change is making it work under a
  sub-path: route through `import.meta.env.BASE_URL` (see `ROUTER_BASE` in
  `v1/src/lib/utils.ts`) so it runs both at `/` and at `/archive/<label>/`.
- **Served, not checked.** `frontend/Dockerfile` builds each archived version in its own
  stage with `vite build --base=/archive/<label>/` and copies it beside the live build;
  `frontend/nginx.conf` routes the sub-path. CI lint and type-check still only cover
  `frontend/` and `backend/`, and root `lint-staged` only globs those two.
- **Ignored artifacts.** The root `.gitignore` matches `node_modules/` and `dist/` at
  any depth, so build output inside a version folder stays out of git automatically.

## Archiving the next version

```sh
git mv frontend archive/vN
rm -rf archive/vN/dist
```

Then scaffold a fresh `frontend/`, add a row to the table above, and:

1. Make `archive/vN` sub-path aware (see Conventions).
2. Add a build stage for it in `frontend/Dockerfile` and copy its `dist` to
   `/usr/share/nginx/html/archive/<label>`.
3. Add its `location` blocks in `frontend/nginx.conf` (exact-match redirect, assets,
   SPA fallback), mirroring vI's.
4. Add an entry to `frontend/src/content/versions.ts`.
