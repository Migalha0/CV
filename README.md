# Gabriel Magalhães Barros — Portfolio

**Live:** https://cv-eight-pi.vercel.app

My CV and portfolio as a single-page site, built from scratch with React, TypeScript, Tailwind CSS and hand-written WebGL. The design is deliberately sharp and "pixel perfect": hard offset shadows, 2px dithered patterns and clipped corners. There is no UI library.

## Features

- **Projects pulled live from GitHub.** Repositories are fetched from the GitHub API on load. Forks and excluded repos are skipped, and the rest are sorted by featured order, then by last push. Responses are cached per session to stay under the unauthenticated rate limit.
- **`#tags` in repo descriptions.** Words starting with `#` in a repo description (e.g. `#AI`) are removed from the text and shown as tag chips. `C#`-style words are left alone.
- **Shader-framed AI projects.** Cards tagged `#AI` get an animated GLSL frame that shows through the card border and hard shadow. It only animates while on screen and respects `prefers-reduced-motion`.
- **Image previews.** If a repo has a `preview.{jpg,png,jpeg,webp,gif}` file in its root, the card shows it on hover, or on tap or keyboard toggle.
- **Live demo links.** A repo's GitHub "Website" field shows up as a **LIVE DEMO** button.
- **Dark mode.** It follows the system setting, can be toggled, and is remembered. The theme is applied before first paint, so there is no flash.
- **Responsive.** On phones the sidebar becomes a swipeable drawer.

## Stack

React 19 · TypeScript · Tailwind CSS 4 · Vite · WebGL (GLSL) · Vercel

## Running locally

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build
npm run lint
```

## Editing content

- Personal info, skills, languages and experience: [`src/data/manual_data.ts`](src/data/manual_data.ts)
- Pin projects to the top: add repo names to `featured_repos` in the same file.
- Hide a repo: add it to `excluded_repos`.
- Downloadable CV: place the PDF at `public/cv.pdf`.
