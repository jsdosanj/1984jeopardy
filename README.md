# 1984 Jeopardy

Interactive Jeopardy game covering the events of June and November 1984 in Sikh history.

Built with React 18, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- 2 to 4 teams with custom names and color coding
- 5 categories, 25 questions, 100/200/300/400/500 point values
- Daily Double with custom wager input
- Wrong answer passes to next team with no penalty
- If no team answers correctly, the question is retired
- Animated game board, Daily Double reveal, and victory screen
- Deep blue + orange color theme

## Project Structure

```
├── .github/workflows/deploy.yml   GitHub Actions auto-deploy
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── index.css
    ├── types.ts
    ├── data.ts
    └── App.tsx
```

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Deploy to GitHub Pages

### Option 1 — Automatic (recommended)

Push to `main`. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

Before the first deploy, enable GitHub Pages in your repo settings:

1. Go to Settings → Pages
2. Set Source to "GitHub Actions"

Your game will be live at: `https://jsdosanj.github.io/1984jeopardy/`

### Option 2 — Manual

```bash
npm install
npm run deploy
```

This runs `gh-pages -d dist` after building.

## Notes

- `vite.config.ts` sets `base: '/1984jeopardy/'` to match the GitHub Pages subdirectory path.
- If you rename the repo, update the `base` value in `vite.config.ts` to match.
