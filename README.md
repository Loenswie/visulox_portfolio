# VISULOX

The creative identity of **Louis Lefebure** — a Belgian multidisciplinary creative working at the
intersection of graphic design and software engineering.

*"The art of creating your vision."*

A cinematic, editorial one-page-feel portfolio built with Vue 3, TypeScript and GSAP. Raw editorial
grunge aesthetic: deep ink black, warm cream typography, a single violet accent, oversized kinetic
type, and restrained, premium motion throughout.

---

## Stack

- **Vue 3** (`<script setup>`) + **TypeScript** + **Vite**
- **GSAP** + **ScrollTrigger** for scroll-driven reveals, parallax and pinning
- **SplitType** for kinetic/typographic word & character reveals
- **Lenis** for buttery smooth scrolling, synced to GSAP's ticker
- **Pinia** for small global UI state (loader, About overlay, mobile menu)
- **Vue Router** with lazy-loaded routes and animated page transitions
- **SCSS** with a centralized design-token system (`src/styles`)

## Project structure

```
src/
  animations/       reusable GSAP helpers (reveal.ts, splitText.ts) + the shared motion timing system
  components/
    about/          the About overlay ("not a page" — opens as a cinematic modal)
    home/           Hero, StatsStrip, Pillars, WorkPreview, Finale
    layout/         Navbar, Footer
    ui/             MagneticButton, SoundToggle, SplitText, SectionHeading
    work/           ProjectCard
  composables/      useLenis, useCustomCursor, useMagnetic, useSound, useHead, useLockScroll
  data/             projects.ts (typed) + projects.json (edit this to add/change projects)
  layouts/          DefaultLayout (Navbar + routed page + Footer + About overlay)
  pages/            HomePage, WorkPage, ProjectDetailPage, NotFoundPage
  stores/           ui.ts (Pinia)
  styles/           design tokens, mixins, reset, typography, grain, cursor, scrollbar
```

Real personal assets (the VISULOX wordmark and both portrait photos) already live in
`/SOURCEFILES` at the project root. Vite is configured with `publicDir: 'SOURCEFILES'`
(see `vite.config.ts`), so that folder **is** the site's public/static directory — anything in
it is served from `/` in dev and copied verbatim into `dist/` on build. That's why components
reference the images as plain root paths, e.g. `/logo_white.png`, `/Profielfoto_Grungy.jpg`,
`/Profielfoto_Normal.jpg`. Drop any future static assets (favicon variants, a real `sitemap.xml`,
an ambient audio file at `/audio/ambient.mp3` for the sound toggle) into `/SOURCEFILES` and they'll
just work.

## Content: editing projects

All project data lives in `src/data/projects.json` — a plain array, no CMS required. Each entry
supports:

```ts
title, slug, category, year, thumbnail, heroImage, galleryImages[],
shortDescription, longDescription, services[], technologies[],
featured, externalLink, behanceLink
```

`category` must be one of: `Branding`, `Web Design`, `Development`, `Campaigns`, `Photography`,
`Digital Experiences` (these drive the filter pills on `/work`). Set `featured: true` to surface a
project in the homepage "Selected Work" strip. The eight seeded entries use
[Lorem Picsum](https://picsum.photos) placeholder photography — swap `thumbnail` / `heroImage` /
`galleryImages` for real project imagery whenever it's ready; no other code changes are needed.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

```bash
npm run build     # type-checks with vue-tsc, then builds to dist/
npm run preview   # serve the production build locally
```

> This project was scaffolded and written directly on disk in this environment (its sandbox
> couldn't run a live shell this session), so `npm install` has not been run yet and the build has
> not been verified end-to-end here. Run `npm install && npm run build` once locally — if `vue-tsc`
> surfaces any type nits, `npm run build:skip-check` builds without the type-check gate while you
> fix them.

## Git

The repo has not been initialized yet. From the project root:

```bash
git init
git add .
git commit -m "Initial commit — VISULOX portfolio"
```

## Deployment

Config files for both are included and pre-wired for SPA routing (`/work/:slug` deep links, etc.):

- **Vercel** — `vercel.json` (framework preset: Vite, build: `npm run build`, output: `dist`)
- **Netlify** — `netlify.toml` (build: `npm run build`, publish: `dist`, SPA redirect to `index.html`)

Either platform: connect the repo (or drag-and-drop the `dist/` folder for a one-off deploy),
no environment variables are required.

## Performance & accessibility notes

- All motion uses `transform`/`opacity` only — no layout-triggering properties are animated.
- `prefers-reduced-motion` is respected globally (see `src/animations/motion.ts` and `_reset.scss`)
  — reveals resolve instantly instead of animating.
- Images use `loading="lazy"` / `decoding="async"` outside the hero; routes are code-split via
  dynamic `import()` in `src/router/index.ts`; GSAP is split into its own chunk in `vite.config.ts`.
- Custom cursor and grain overlay are disabled/inert on touch devices via `(hover: hover) and
  (pointer: fine)` media queries.
- Semantic landmarks (`header`, `main`, `footer`, `nav`), a skip-link, visible focus rings, and a
  real `role="dialog"` + `Escape`-to-close + focus move on the About overlay are all in place.

## Sound toggle

`src/composables/useSound.ts` wires up a muted-by-default ambient toggle in the navbar. It expects
an optional file at `/audio/ambient.mp3` (i.e. `SOURCEFILES/audio/ambient.mp3`) — if it isn't
present, the toggle still animates but stays silent rather than throwing. Add a short, tasteful
ambient loop there whenever one is ready.
