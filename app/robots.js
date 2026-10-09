import { SITE_URL } from '@/src/data/profile';

export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` };
}
