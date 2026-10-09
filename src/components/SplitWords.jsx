// Server-rendered word split for staggered reveals. Screen readers get the plain text once.
export function SplitWords({ text, as: Tag = 'span', className = '', reveal = true }) {
  const words = text.split(' ');
  return (
    <Tag className={className} {...(reveal ? { 'data-reveal-words': '' } : {})}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <span className="word">
              <span>{word}</span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
