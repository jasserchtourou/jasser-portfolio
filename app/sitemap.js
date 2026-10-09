import { SITE_URL } from '@/src/data/profile';

export default function sitemap() {
  const routes = ['', '/projects', '/work/routeflow', '/work/sentrymesh'];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : route.startsWith('/work') ? 0.9 : 0.7,
  }));
}
