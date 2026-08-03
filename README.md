# Note Manager

## Setup

This project uses [Bun](https://bun.sh) as both package manager and script runner.

```sh
bun install
```

## Available Scripts

Always use `bun run <script>`, not the bare `bun <script>` shorthand — `bun build` and `bun test` are Bun's own built-in commands (bundler / test runner) and will shadow the scripts below if you drop `run`.

- `bun run dev` — start the Vite dev server
- `bun run build` — production build (outputs to `dist/`)
- `bun run preview` — locally preview the production build
- `bun run test` — run the test suite (Vitest)
- `bun run lint` — run ESLint over `src/`
