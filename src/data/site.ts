/**
 * Single source of truth for identity and contact details.
 *
 * To add LinkedIn: uncomment the entry below and drop in the profile URL.
 * Both the footer and the landing-page CTA read from `contactLinks`, so no
 * other file needs to change.
 */

export const site = {
  name: 'Aaron Isaacs',
  role: 'Lead Backend Software Engineer / Technical Product Lead',
  tagline:
    'Backend, cloud, and distributed systems. Python and AWS by trade, Go by choice.',
  email: 'isaacsaaron@gmail.com',
  github: 'https://github.com/aaron-isaacs-01',
} as const;

export interface ContactLink {
  label: string;
  href: string;
}

export const contactLinks: ContactLink[] = [
  { label: 'Email', href: `mailto:${site.email}` },
  { label: 'GitHub', href: site.github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aaron-m-isaacs/' },
];
