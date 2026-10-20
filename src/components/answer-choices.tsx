import type { CSSProperties } from 'react';
import { MathText } from './math-text';
import { getCombinationOptions } from '@/lib/combination-options';
import { optionLabels, optionMarkLabels, optionMarkSymbols, type Attempt, type Draft, type OptionId, type OptionMark, type Question } from '@/lib/model';
import { cn } from '@/lib/utils';

type AnswerChoicesProps = {
  question: Question; draft: Draft; result: Attempt | null; locked: boolean;
  onAnswer: (id: OptionId) => void; onMark: (id: OptionId) => void;
};

function MarkButton({ id, mark, locked, onMark }: { id: OptionId; mark: OptionMark; locked: boolean; onMark: (id: OptionId) => void }) {
  return <button type="button" className="choice-mark-toggle" data-mark={mark} disabled={locked}
    aria-label={`${optionLabels[id]}の印：${optionMarkLabels[mark]}`}
    title="初めは ?、押すと ○ → × → △ → ○ の順に切り替え" onClick={() => onMark(id)}>
    <span aria-hidden="true">{optionMarkSymbols[mark]}</span>
  </button>;
}

export function AnswerChoices({ question, draft, result, locked, onAnswer, onMark }: AnswerChoicesProps) {
  const combination = getCombinationOptions(question.options);
  const selected = result ? result.selected : draft.selected;
  if (combination) {
    const stackOnMobile = combination.headers.length > 3 || combination.rows.some(row => row.values.some(value => value.length > 24));
    return <div className={cn('choices combination-choices', stackOnMobile && 'combination-long')}
      style={{ '--combination-columns': combination.headers.length } as CSSProperties}>
      <table className="combination-table" role="table" aria-label="選択肢の組み合わせ">
        <thead role="rowgroup"><tr role="row">
          <th scope="col" role="columnheader" className="combination-letter-heading">回答</th>
          {combination.headers.map((header, i) => <th scope="col" role="columnheader" id={`combination-header-${i}`} key={header}><MathText text={header} /></th>)}
          <th scope="col" role="columnheader" className="combination-mark-heading" />
        </tr></thead>
        <tbody role="rowgroup">{combination.rows.map(row => {
          const correct = Boolean(result) && row.id === question.correct;
          return <tr key={row.id} role="row" className={cn('combination-row', selected === row.id && 'choice-selected', correct && 'choice-correct')}>
            <th scope="row" role="rowheader" className="combination-letter-cell">
              <button type="button" className="combination-answer" disabled={locked} data-testid={`option-${row.id}`}
                aria-label={`${optionLabels[row.id]}で回答`} aria-describedby={`choice-text-${row.id}`} onClick={() => onAnswer(row.id)}>
                <span className="choice-letter">{optionLabels[row.id]}</span>
                {correct && <span className="combination-outcome">正解</span>}
                {result && selected === row.id && !correct && <span className="combination-outcome">回答</span>}
              </button>
              <span className="sr-only" id={`choice-text-${row.id}`}><MathText text={question.options.find(option => option.id === row.id)!.text} /></span>
            </th>
            {row.values.map((value, i) => <td key={i} role="cell" headers={`combination-header-${i}`} className="combination-cell">
              <span className="combination-cell-label" aria-hidden="true"><MathText text={combination.headers[i]} /></span>
              <MathText text={value} />
            </td>)}
            <td role="cell" className="combination-mark-cell"><MarkButton id={row.id} mark={draft.optionMarks?.[row.id] ?? 'unknown'} locked={locked} onMark={onMark} /></td>
          </tr>;
        })}</tbody>
      </table>
    </div>;
  }
  return <div className="choices">{question.options.map(option => <div key={option.id} className={cn('choice-card', selected === option.id && 'choice-selected')}>
    <button type="button" className="answer-selector" disabled={locked} data-testid={`option-${option.id}`} aria-label={`${optionLabels[option.id]}で回答`} aria-describedby={`choice-text-${option.id}`} onClick={() => onAnswer(option.id)}>
      <span className="choice-letter">{optionLabels[option.id]}</span><span id={`choice-text-${option.id}`} className="choice-text">{option.figure ? <><span className="choice-figure" dangerouslySetInnerHTML={{ __html: option.figure }} /><span className="sr-only">{option.text}</span></> : <MathText text={option.text} />}</span>
    </button>
    <MarkButton id={option.id} mark={draft.optionMarks?.[option.id] ?? 'unknown'} locked={locked} onMark={onMark} />
  </div>)}</div>;
}
