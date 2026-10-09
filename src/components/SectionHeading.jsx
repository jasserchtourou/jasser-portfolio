import { SplitWords } from '@/src/components/SplitWords';

export function SectionHeading({ id, eyebrow, title, intro, className = '' }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="h-section mt-4">
        <SplitWords text={title} />
      </h2>
      {intro ? (
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg" data-reveal>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
