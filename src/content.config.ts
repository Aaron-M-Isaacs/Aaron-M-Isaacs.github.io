import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects.
 *
 * The schema is deliberately shaped so that adding one of the deferred write-ups
 * later is a content-only change: drop a new Markdown file into
 * src/content/projects/ and it appears on the index and gets its own route.
 * Set `draft: true` to keep one out of the build entirely.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences; used on cards and as the page meta description. */
    summary: z.string(),
    /** Technologies shown as chips, e.g. ['Go', 'AWS Lambda']. */
    stack: z.array(z.string()),
    /** Headline numbers, e.g. { label: 'Full run', value: '< 2 seconds' }. */
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .default([]),
    /** Ascending display order on the landing page and index. */
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
