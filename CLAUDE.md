# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Developer portfolio site for Aaron Isaacs, built with Astro 7 (static output) and deployed to GitHub
Pages at <https://Aaron-M-Isaacs.github.io>. Content-driven: case studies are Markdown files in a content
collection, not hand-written pages.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Serve the build locally |
| `npm run check` | `astro check` — types, Astro files, and content-collection schema |

There is no test suite; this is a static content site with no application logic. Verification is
`npm run build` + `npm run check` + a link check (`npx linkinator ./dist --recurse`).

## Architecture

- **`src/content.config.ts`** defines the single `caseStudies` collection. Its schema (`title`,
  `summary`, `stack`, `metrics`, `order`, `draft`) is the contract every write-up must satisfy.
- **Adding a case study is a content-only change** — drop a Markdown file in
  `src/content/case-studies/` and it gets a card plus its own route. Do not add per-case-study
  components or pages.
- **`draft: true` removes an entry entirely** — no route, no card. `src/pages/case-studies/[...slug].astro`
  and both index pages filter on it. Keep that filter in place when editing those files.
- **`src/data/site.ts`** is the single source of truth for name, role, and contact links. The footer
  and landing CTA both read `contactLinks`; add a link there, not inline in a component.
- **`src/styles/global.css`** holds all design tokens as custom properties on `:root`. Components use
  scoped `<style>` blocks that reference those tokens — avoid hard-coded colors and spacing.

## Constraints that will break things

- **Never add a `base` key to `astro.config.mjs`.** This is a `<username>.github.io` user repository
  serving from the domain root; setting `base` 404s every asset and link.
- **Never commit `context.md` or the resume PDF.** Both are gitignored reference material. `context.md`
  holds the source bio and case-study notes; content is transcribed into committed Markdown by hand,
  never imported at build time.
- **Do not add `.nojekyll`.** Pages is configured with `build_type: workflow`, so the Actions artifact
  is served as-is and Jekyll never processes it.
- **Content accuracy matters more than usual here** — this is job-search material. Every factual or
  numeric claim on the site must trace back to `context.md`. Do not invent metrics, dates, employers,
  or outcomes.

## Design

Dark-only by intent, minimal/technical: monospace headings and labels, one accent color
(`--accent: #4dd6a8`), code blocks styled as a first-class element. Text/background pairs are chosen
to clear WCAG AA (4.5:1); re-verify if you change palette tokens. A light theme would be a drop-in
addition — redefine the `:root` tokens under a media query.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` builds via `withastro/action` and publishes via
`actions/deploy-pages`. Pages source is set to GitHub Actions in repo settings.
