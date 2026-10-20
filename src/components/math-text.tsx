import { lazy, memo, Suspense, useMemo, type ReactNode } from 'react';

// Load the typesetter and its fonts only when a question contains a formula.
// Missing chunks (for example after a deployment) must not unmount the exercise.
const MathFormula = lazy(() => import('./math-formula').catch(() => ({ default: MathFallback })));

function MathFallback({ tex, display }: { tex: string; display: boolean }) {
  return <span className={display ? 'math-fallback math-display' : 'math-fallback'}>{tex}</span>;
}

export const MathText = memo(function MathText({ text }: { text: string }) {
  const content = useMemo(() => {
    const parts: ReactNode[] = [];
    const pattern = /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g;
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
      const index = match.index;
      if (index > cursor) parts.push(text.slice(cursor, index));
      const tex = match[1] ?? match[2];
      parts.push(<Suspense key={index} fallback={<span>{tex}</span>}><MathFormula tex={tex} display={match[2] !== undefined} /></Suspense>);
      cursor = index + match[0].length;
    }
    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
  }, [text]);
  return <span className="math-text">{content}</span>;
});
