# Time To Interactive

React single-page app for analog-clock time phrases. Vite bundles the UI; production is static assets suitable for GitHub Pages.

**Production:** [https://content-interactives.github.io/time_to/](https://content-interactives.github.io/time_to/)

---

## Stack

| Layer | Packages / tooling |
|--------|---------------------|
| UI | React 19 (`react`, `react-dom`) |
| Build | Vite 7, `@vitejs/plugin-react` |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| Feedback | `canvas-confetti` (correct-answer celebration) |
| Lint | ESLint 9 (flat config), React Hooks / Refresh plugins |
| Deploy | `gh-pages` → `dist` |

Runtime dependencies are ES modules; `package.json` sets `"type": "module"`.

---

## Build and routing

`vite.config.js` sets `base: '/time_to/'` so asset URLs resolve under the GitHub Pages project path. For a different host or root path, change `base` accordingly.

| Script | Command |
|--------|---------|
| Development | `npm run dev` — Vite dev server (HMR) |
| Production bundle | `npm run build` — output in `dist/` |
| Local preview of `dist` | `npm run preview` |
| Deploy | `npm run deploy` — runs `predeploy` (`vite build`) then `gh-pages -d dist` |

---

## Repository layout

| Path | Role |
|------|------|
| `index.html` | Shell; mounts `#root` |
| `src/main.jsx` | `createRoot`, `StrictMode`, global CSS import |
| `src/App.jsx` | Renders `TimeTo` |
| `src/components/TimeTo.jsx` | Game state, phrase logic, layout, audio |
| `src/components/Clock.jsx` | Alarm-clock visuals; hand angles from `hour` / `minute` |
| `src/components/ui/reused-ui/*` | Shared chrome (`Container`, buttons, etc.) |
| `src/components/*.css` | Component styles (clock face, snooze animation, etc.) |
| `src/index.css` | Tailwind entry (`@tailwind` directives) |
| `public/` | Static files copied to `dist` as-is |

---

## Application logic (summary)

- **Random times:** Hour in 1–12; minutes restricted to `{0, 15, 30, 45}` (`generateRandomTime`).
- **Target phrases:** `getPhraseForTime` maps those minutes to *o'clock*, *Quarter past*, *Half past*, *Quarter to* (next hour in 12-hour form). Comparison is case-insensitive trimmed string equality.
- **Clock geometry:** `Clock.jsx` normalizes hour (mod 12) and minute (mod 60). Minute hand: `minute * 6`°; hour hand: `hour * 30 + minute * 0.5`°. Face, ticks, numerals, and alarm styling are DOM/CSS (no canvas/SVG for the dial except handle path in JSX read further in file).
- **UX:** Four answer buttons always show the four phrase variants for the current displayed hour context; wrong taps toggle a short “snooze” visual; correct tap plays confetti, short animation gate (`isClockAnimating`), then a new random time. Optional sound button triggers bundled MP3 via `HTMLAudioElement`.
- **Responsive:** Viewport width scales clock and mascot below ~345px width.

---

## Product integration

CK-12 and other embed targets: production/master and Flexbook links are tracked in-repo where still pending.

- **CK-12 Intent Response** — production / master: pending  
- **CK-12 Flexbooks** — book/lesson link: pending  

Upstream repo reference: [github.com/Content-Interactives/time_to](https://github.com/Content-Interactives/time_to).

---

## Educational alignment

Grade band, topic, and Common Core citations are listed in [`Standards.md`](Standards.md) (e.g. CCSS 2.MD.C.7, 3.MD.A.1).
