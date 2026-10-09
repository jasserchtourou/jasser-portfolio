import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="page flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="h-section mt-4">This route doesn’t exist.</h1>
      <p className="mt-4 max-w-xl text-muted">The page may have moved in the redesign. Everything worth seeing is one click away.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/work/routeflow" className="btn-ghost">
          RouteFlow case study
        </Link>
      </div>
    </div>
  );
}
