// Content lives in content/profile.json and is edited from the back office (/admin/profile).
// Source of truth: Jasser_Chtourou_CV.pdf (+ facts supplied by Jasser, see README "Content sources").
import data from '@/content/profile.json';

export const SITE_URL = 'https://jasser-portfolio-topaz.vercel.app';

export const { profile, heroStats, education, languages } = data;

// The total is derived so it can never drift from the list.
export const certifications = {
  ...data.certifications,
  total: data.certifications.groups.reduce((n, g) => n + g.items.length, 0),
};
