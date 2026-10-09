// Converts source images into optimized WebP files under public/images.
// Usage: node scripts/optimize-images.mjs <routeflowRepoDir> <sentrymeshSlidesDir>
//   <sentrymeshSlidesDir> holds PNG renders of the presentation (p1.png ... p7.png).
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const out = (...p) => path.join(root, 'public', 'images', ...p);
const [routeflowDir, slidesDir] = process.argv.slice(2);

async function webp(src, dest, width, quality = 80) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const info = await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(dest);
  console.log(`${path.relative(root, dest)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

// Profile photo
await webp(path.join(root, 'public/images/jasser-photo.png'), out('jasser-photo.webp'), 480, 85);

// RouteFlow screenshots (docs/screenshots only; docs/reference holds third-party images and is never used)
if (routeflowDir) {
  const shots = ['dashboard', 'orders', 'shipments', 'routes', 'events', 'tracking', 'warehouse-3d-night', 'warehouse-3d-day'];
  for (const name of shots) {
    const src = path.join(routeflowDir, 'docs/screenshots', `${name}.png`);
    await webp(src, out('routeflow', `${name}-1600.webp`), 1600);
    await webp(src, out('routeflow', `${name}-800.webp`), 800, 75);
  }
}

// SentryMesh slides
if (slidesDir) {
  const slides = { p1: 'title', p3: 'architecture', p4: 'lifecycle', p5: 'routing' };
  for (const [file, name] of Object.entries(slides)) {
    const src = path.join(slidesDir, `${file}.png`);
    await webp(src, out('sentrymesh', `${name}-1600.webp`), 1600, 85);
    await webp(src, out('sentrymesh', `${name}-800.webp`), 800, 80);
  }
}
