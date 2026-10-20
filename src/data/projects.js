// Content lives in content/projects.json and is edited from the back office (/admin/projects).
// Facts come from: the CV, Jasser's LinkedIn project entries, the RouteFlow repository, the
// SentryMesh presentation, the live La Forêt site and Jasser's public GitHub / YouTube.
// `home: true` puts a project in the home page's "Selected work" grid.
import data from '@/content/projects.json';

export const { projects } = data;
export const homeProjects = projects.filter((p) => p.home);
export const getProject = (slug) => projects.find((p) => p.slug === slug);
