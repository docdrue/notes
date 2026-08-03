# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A small React notes/folders manager, built on Vite. Originally bootstrapped with Create React App, then fully migrated off CRA/webpack/Babel/Jest to Vite/SWC/Vitest (2026-08-03), then the package manager went npm → Yarn Berry → Bun, all on 2026-08-03 — see "Toolchain" and "Package manager" below.

## Commands

- `bun install` — install deps. Bun is both the package manager and script runner (`packageManager` field in `package.json` pins the version); `bun.lock` (text format, not the older binary `bun.lockb`) is authoritative.
- `bun run dev` — Vite dev server (`vite --open`). Serves over HTTPS via `vite-plugin-mkcert` (self-signed local cert, browser will warn once).
- `bun run build` — production build (`vite build`) to `dist/`. `vite-plugin-checker` runs ESLint as part of the build and fails the build on lint *errors* (not warnings).
- `bun run preview` — locally serve the `dist/` build.
- `bun run test` — Vitest, `environment: jsdom`, `globals: true` (so `it`/`describe`/etc. are ambient, no import needed — see `src/App.test.jsx`). Run a single file with `bun run vitest run src/App.test.jsx`.
- `bun run lint` — ESLint over `src/` (flat config, `eslint.config.js`).
- **Always use `bun run <script>`, never the bare `bun <script>` shorthand, for `build` and `test` specifically** — `bun build` and `bun test` are Bun's own built-in commands (bundler and test runner, respectively) and take priority over same-named `package.json` scripts. `bun dev`/`bun lint`/`bun preview` happen to work today because Bun has no built-in of those names, but don't rely on that — use `run` uniformly.
- **Node version constraint**: `jsdom` is pinned to `^29.1.1`, not latest. jsdom 30 requires Node `^22.22.2 || ^24.15.0 || >=26.0.0`; this environment runs Node 20.19.0 (Bun itself has no such constraint — this is about the Node runtime Vitest's jsdom environment needs). Bump jsdom only after bumping Node.

## Package manager

Bun (currently `1.2.19`), both installing dependencies and running scripts — not just an npm/yarn-compatible installer bolted onto Node. `bun.lock` is a Bun-native text lockfile format, not compatible with `package-lock.json` or `yarn.lock`; don't hand-edit it.

Bun blocks lifecycle (postinstall) scripts for dependencies by default, same spirit as Yarn Berry's script-blocking. `@swc/core`'s postinstall is currently blocked (`bun pm untrusted` to see, `bun pm trust <pkg>` to allow) and this is fine — the actual native binary comes from the `@swc/core-darwin-arm64` optional dependency, which installs regardless of whether the postinstall script runs; the postinstall is just a verification/logging step. Don't blanket-trust it without checking what changed if this ever needs revisiting.

Bun does **not** have Yarn's package-quarantine feature (no `YN0016`-style delay on freshly-published versions) — `globals` is back to a plain `^17.9.0` here (it was temporarily pinned to `^17.8.0` during the Yarn era specifically to dodge that check, which no longer applies).

## Toolchain

Vite + `@vitejs/plugin-react-swc` (SWC, not Babel — Babel has been fully removed from this project) + Vitest. Entry: `index.html` (root) → `src/index.jsx` (`createRoot`, React 19 API). Path aliases in `vite.config.ts` (`components`, `containers`, `hooks` → `src/components`, `src/containers`, `src/hook-store`) exist but nothing in `src/` actually uses them — imports are all relative.

CSS: only `.module.css` files get CSS-modules treatment (named/default JS exports) under Vite; plain `.css` is a side-effect-only import with no exports. `Toolbar.module.css` and `Layout.module.css` are real CSS modules (imported as `import styles from './X.module.css'`, used as `styles.ClassName`). Under the old webpack config this same pattern was used on plain `.css` files (not `.module.css`) and silently no-op'd (`styles` resolved to `undefined`, so the classes were never actually applied) — webpack/CommonJS interop tolerates a missing default export; Rollup/ESM does not, so this had to be fixed (renamed to `.module.css`) as part of the Vite migration rather than left broken.

No TypeScript: the CRA-era scaffold had a stray `src/main.js` (TS syntax in a `.js` file, importing a nonexistent `App.tsx`) and `vite-env.d.ts` left over from an abandoned `create vite --template react-ts`-style setup. Both were deleted rather than finished — the actual app is, and always was, 100% JS/JSX (only `App.js` never got converted). Don't reintroduce TS scaffolding without deciding to actually convert the app.

`vite-plugin-checker` requires `eslint >=9.39.4` for flat-config support — this is a hard version floor, not a "hold back the major version" situation like some of the other pins below.

Package versions are otherwise kept current within each dependency's existing major version (see "Package update" commits) — deliberate major-version holds as of the last update: `eslint` (9.x, not 10), `vite` (7.x, not 8), `@vitejs/plugin-react-swc` tracks 4.x, `vite-plugin-svgr` (4.x, not 5), `dotenv-expand` was removed entirely (no longer a dependency — see below).

## Architecture

- `src/App.jsx` renders `src/containers/Layout/Layout.jsx`, which composes the `Tree` container and the top-level components (`Folders`, `Notes`, `Search`, `Toolbar`).
- `src/components/` — presentational pieces, one subfolder per feature (`Folders/Folder`, `Notes/Note`, `Search`, `Toolbar`). None currently take props except `Folder` (`name`).
- `src/containers/` — composition/layout components (`Layout`, `Tree`) that assemble components together.
- `src/hook-store/` — hand-rolled global state, not Redux/Context: `store.js` exports `useStore()`/`initStore()`, a pub-sub hook store (module-level `globalState` + `listeners` array, actions are plain reducer functions keyed by name, `dispatch` runs the named action and notifies all mounted `useStore()` listeners). `folders-store.js` is meant to call `initStore()` with folder-fetching actions but is currently stubbed out (commented-out body, no-op `configureStore()`) — this is deliberate WIP, not migration fallout; leave the commented-out plan alone unless asked to implement it. `fetch-hook.js` holds fetch-related hook logic (`useFetch`), used by `Folders.jsx` against `http://localhost:3001/directories` — there's no backend for this in the repo, so it fails gracefully (caught, dispatched as an error state) when nothing is listening on that port.

## Dependency footprint

Only 5 runtime `dependencies`: `react`, `react-dom`, and the 3 `@fortawesome/*` packages actually imported in `src/` (`fontawesome-svg-core`, `free-solid-svg-icons`, `react-fontawesome` — the `free-brands`/`free-regular` icon packs and the CSS-based `fontawesome-free` package were unused and removed). Everything CRA/webpack/Babel/Jest-related (`babel-*`, `webpack*`, `jest*`, `css-loader`, `*-loader`, `postcss-*`, `react-app-polyfill`, `react-dev-utils`, `dotenv*`, etc.) was removed as dead weight during the Vite migration — if you find yourself wanting to add one of these back, the app almost certainly doesn't need it; Vite/Rollup covers the same ground natively.

## Migration changelog: CRA/Babel → Vite (completed 2026-08-03)

Full itemized record of what changed, for anyone diffing behavior against the pre-migration repo.

**Entry point**
- Added root `index.html` (Vite's required entry template; previously only `public/index.html`, a CRA template using `%PUBLIC_URL%` templating Vite doesn't support, existed).
- Added `src/index.jsx` — new entry, uses React 19's `createRoot` API.
- Deleted `src/index.js` — old entry, used the removed `ReactDOM.render` API (would have thrown under React 19 regardless of the toolchain).
- Deleted `src/main.js` — a broken, unused Vite/TypeScript scaffold entry (TS syntax in a `.js` file, imported a nonexistent `App.tsx`).
- Deleted `src/vite-env.d.ts` — dead TS-scaffold leftover, no `tsconfig.json` ever existed.
- Deleted `public/index.html` — stale CRA template; keeping it risked Vite's build copying it over the real generated `dist/index.html` (`public/` is copied into the build output as-is).

**File renames** (`.js` → `.jsx`, needed for Vite's default JSX handling; extensionless imports elsewhere needed no changes)
`App.js`, `App.test.js`, `components/Toolbar/Toolbar.js`, `components/Search/Search.js`, `components/Notes/Notes.js`, `components/Notes/Note/Note.js`, `components/Folders/Folders.js`, `components/Folders/Folder/Folder.js`, `containers/Tree/Tree.js`, `containers/Layout/Layout.js`.

**CSS fixes**
- `Toolbar.css` → `Toolbar.module.css`, `Layout.css` → `Layout.module.css` (imports updated to match). These files were already being imported as `import styles from './X.css'` and used as `styles.ClassName` — a CSS-modules pattern — but weren't named `.module.css`, so under webpack/CommonJS this silently resolved to `undefined` (no crash, just no styling ever applied) and under Rollup/ESM it's a hard build error. Renaming makes the pre-existing intent actually work.
- Deleted `src/containers/Tree/Tree.css` (empty file, its only import was already dead code).

**`vite.config.ts`**
- `@vitejs/plugin-react` → `@vitejs/plugin-react-swc` (removes Babel from the Vite transform pipeline).
- Removed a dead config block: `react({ babel: { plugins: ['babel-plugin-styled-components', ...] } })` — `styled-components` isn't used anywhere in `src/` and the plugin package was never even installed.
- Removed `typescript: true` from the `checker()` plugin options (no `tsconfig.json`, app is pure JS).
- Changed the ESLint check command from `eslint . --ext ts,tsx --max-warnings 0` (wrong extensions for this JS-only app, and would hard-fail the dev/build on any pre-existing warning) to `eslint src --ext js,jsx --report-unused-disable-directives`.
- Added `test: { environment: 'jsdom', globals: true }` and a `/// <reference types="vitest/config" />` triple-slash directive, merging Vitest config into the same file.

**New file: `eslint.config.js`** — flat config (ESLint 9 requires this; none existed before, `package.json`'s old `eslintConfig: { extends: "react-app" }` pointed at a package, `eslint-config-react-app`, that was never actually installed). Built from `@eslint/js` recommended + `eslint-plugin-react` (`flat.recommended` + `jsx-runtime`) + `eslint-plugin-jsx-a11y` (`flatConfigs.recommended`) + `eslint-plugin-react-hooks` + `globals` (browser/node, plus `vitest` globals scoped to `**/*.test.{js,jsx}`).

**`package.json`**
- `scripts`: removed `start` (CRA dev server); `build` and `test` repointed from `node scripts/build.js` / `node scripts/test.js` to `vite build` / `vitest`; added `preview` and `lint`.
- Removed the `jest`, `babel`, and `eslintConfig` top-level config blocks, and the `peerDependencies` block (`eslint: ">=1.6.0 <6.0.0"`, a CRA/`babel-eslint`-era constraint with nothing left to constrain).
- Added `"type": "module"` (safe once `scripts/`/`config/` — the only CJS files in the repo — were deleted; silences a Node warning on `eslint.config.js`).
- `dependencies` pruned from 59 entries to 5: `react`, `react-dom`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`. Confirmed-unused before removal: `@fortawesome/free-brands-svg-icons`, `@fortawesome/free-regular-svg-icons`, `react-router-dom`, `workbox-webpack-plugin`/service-worker registration, any `.scss`/`.sass` files, a `postcss.config.*`, the `path` browser-polyfill package, `@svgr/webpack` (superseded by `vite-plugin-svgr`), plus all Babel/webpack/Jest/CRA-script-only packages.
- `devDependencies`: added `@eslint/js`, `@vitejs/plugin-react-swc`, `eslint-plugin-react-hooks`, `globals`, `jsdom`, `vitest`; moved `eslint-plugin-react` and `eslint-plugin-jsx-a11y` here from `dependencies` (they're dev-only lint tooling); removed `@vitejs/plugin-react` and the unused `@fortawesome/fontawesome-free` (CSS icon font, app only uses the SVG/React components); bumped `vite-plugin-checker` `0.12.0` → `^0.14.5` — not a routine bump, 0.12 predates ESLint 9 flat-config support entirely and would crash (`ESLINT_INVALID_OPTIONS`) the moment `eslint.config.js` existed; pinned `jsdom` to `^29.1.1` rather than latest (30.x requires Node ≥22.22, this environment runs Node 20.19).
- Net effect: `npm install` went from ~1427 packages to ~410; `npm audit` findings went from 25 to 6.

**Deleted the legacy CRA/webpack toolchain entirely**: `scripts/start.js`, `scripts/build.js`, `scripts/test.js`, `config/webpack.config.dev.js`, `config/webpack.config.prod.js`, `config/webpackDevServer.config.js`, `config/paths.js`, `config/env.js`, `config/jest/cssTransform.js`, `config/jest/fileTransform.js`.

**Dead-code cleanup surfaced by having a working linter for the first time** (all zero-behavior-change deletions; the intentionally-commented-out WIP body in `folders-store.js` was left untouched):
- Removed `import React from 'react'` from 9 JSX files — no longer needed, `@vitejs/plugin-react-swc` defaults to the automatic JSX runtime.
- Removed unused imports/vars: `faFolderOpen` (`Folder.jsx`), `opts` (`Folders.jsx`), `styles` (`Tree.jsx`, was importing the now-deleted empty `Tree.css`), `useEffect`/`initStore`/`foldersList` (`folders-store.js`).
- Removed unused `props` parameters (never referenced) from `Note.jsx`, `Notes.jsx`, `Search.jsx`, `Toolbar.jsx`, `Tree.jsx`, `Layout.jsx`.
- `App.test.jsx`: removed unused `React` import, replaced the removed `ReactDOM.render` API with `createRoot`.

**Other**
- `.gitignore`: added `/dist` (Vite's default build output dir; only `/build`, the CRA one, was previously ignored).
- `README.md`: replaced the untouched 1624-line Create React App boilerplate (referenced `npm start`, `npm eject`, `react-scripts`, none of which exist anymore) with a short accurate script reference.

**Left alone on purpose** (pre-existing issues, not migration fallout — flagged, not fixed):
- Three `react-hooks/exhaustive-deps` warnings in `fetch-hook.js` (missing effect dependencies) — behavioral, not dead-code, so left for a deliberate decision rather than silently changed.
- `folders-store.js`'s commented-out `configureStore()` body — clearly an in-progress plan, not something to implement or delete.

## Migration changelog: npm → Yarn (completed 2026-08-03, superseded same day — see next section)

- Deleted `package-lock.json`; `yarn.lock` became the lockfile of record.
- Added `"packageManager": "yarn@4.18.0+sha512...` to `package.json` — this is what makes Corepack (bundled with Node ≥16.9) resolve `yarn` to the right version instead of whatever's installed globally.
- Tried Yarn Classic (`1.22.22`, what was globally installed) first — it failed to install at all (`Invariant Violation: could not find a copy of vite to link in node_modules/vitest/node_modules`), reproducible on a clean cache. Switched to Yarn Berry (latest stable via `corepack use yarn@stable`) instead of debugging Classic further, since Classic is unmaintained and this is a known class of bug in its resolver.
- Added `.yarnrc.yml` with `nodeLinker: node-modules` — Berry defaults to PnP (`.pnp.cjs`, zero `node_modules`), which was overridden for tooling-compatibility reasons.
- Pinned `globals` `^17.9.0` → `^17.8.0` — `17.9.0` had been published the day before this migration and was blocked by Yarn's quarantine check (`YN0016`, all versions satisfying `^17.9.0` quarantined). Not a Yarn bug to work around; a real supply-chain protection to respect.
- `.gitignore`: added the standard Yarn Berry block (`.yarn/*` with negations, plus `.pnp.*`).
- Updated `README.md` and this file's Commands section from `npm`/`npx` to `yarn`.
- Verified `yarn build`, `yarn test`, `yarn lint`, and `yarn dev` all passed.
- **All of this was reverted hours later** when the package manager changed again to Bun (below) — kept here as history, not as current state. `yarn.lock`, `.yarnrc.yml`, and the Yarn Berry `.gitignore` block were all removed in that switch.

## Migration changelog: Yarn → Bun (completed 2026-08-03)

- Deleted `yarn.lock` and `.yarnrc.yml`; ran `bun install`, which generated `bun.lock` (Bun's native text lockfile format — not `package-lock.json`- or `yarn.lock`-compatible).
- `"packageManager"` field: `yarn@4.18.0+sha512...` → `bun@1.2.19`.
- Reverted `globals` `^17.8.0` → `^17.9.0` — the Yarn-era pin existed only to dodge Yarn's quarantine check, which Bun doesn't have; Bun resolves the range normally to the latest matching version.
- `@swc/core`'s postinstall script is blocked by Bun's default lifecycle-script sandboxing (`bun pm untrusted` shows it) — left untrusted since the native binary comes from the `@swc/core-darwin-arm64` optional dependency regardless, and build/dev/test all verified working without trusting it.
- Removed the Yarn Berry block from `.gitignore` (`.yarn/*` negations, `.pnp.*`) — no longer applicable.
- Updated `README.md` and this file's Commands/Package-manager sections from `yarn`/`yarn x` to `bun install`/`bun run x`, and documented the `bun build`/`bun test` built-in-command shadowing gotcha (see Commands above) — this didn't exist as a footgun under Yarn or npm.
- Verified `bun run build`, `bun run test`, `bun run lint`, and `bun run dev` (dev server serving over HTTPS, 200 response) all pass.
