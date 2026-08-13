# Aaron Isaacs portfolio page.

Developer portfolio site for Aaron Isaacs, built with [Astro](https://astro.build) and hosted on
GitHub Pages at <https://Aaron-M-Isaacs.github.io>.

## Commands

All commands run from the repository root:

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the build locally before deploying |
| `npm run check` | Type-check Astro, TypeScript, and content collections |

## Project structure

```
src/
  content/case-studies/   Case-study write-ups (Markdown)
  content.config.ts       Collection schema
  components/             Header, Footer, SEO, CaseStudyCard
  layouts/                BaseLayout, CaseStudyLayout
  pages/                  Routes (index, about, case-studies)
  data/site.ts            Name, role, and contact links
  styles/global.css       Design tokens and base styles
public/                   Static assets served as-is (favicon, robots.txt)
```

## Adding a case study

Create a Markdown file in `src/content/case-studies/`. The filename becomes the URL slug. No code
changes are needed — it appears on the landing page and the index, and gets its own route.

```markdown
---
title: 'Title of the write-up'
summary: >-
  One or two sentences. Used on the card and as the page meta description.
stack:
  - Python
  - AWS
metrics:
  - label: Runtime
    value: '< 2 seconds'
order: 4
draft: false
---

## Context
...
```

Set `draft: true` to keep a write-up out of the build entirely — it generates no route and no card.

The schema lives in `src/content.config.ts`; `npm run check` validates every file against it.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages. The repository's Pages source is set to **GitHub Actions** (not branch-based), so no
`.nojekyll` file is required.

`astro.config.mjs` sets `site` but deliberately has **no `base` key** — this is a
`<username>.github.io` user repository, which serves from the domain root. Adding `base` would break
every asset path and link.

