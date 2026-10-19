import { useMemo } from 'react';
import { renderToString } from 'katex';
import 'katex/dist/katex.min.css';

export default function MathFormula({ tex, display }: { tex: string; display: boolean }) {
  const html = useMemo(() => {
    try {
      return renderToString(tex, {
        displayMode: display, output: 'htmlAndMathml', trust: false,
        throwOnError: true, strict: 'error', maxExpand: 1000, maxSize: 20,
      });
    } catch {
      // A malformed formula must not prevent the learner from answering.
      return null;
    }
  }, [tex, display]);
  if (html === null) return <span className="math-fallback">{tex}</span>;
  return <span className={display ? 'math-display' : 'math-inline'} tabIndex={display ? 0 : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}
