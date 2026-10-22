import { optionIds, optionLabels, type OptionId, type Question } from './model';

export function shuffleOptionOrder(random = Math.random): OptionId[] {
  const order = [...optionIds];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// The original IDs stay attached to the content for grading, notes and history.
// Only the visible labels follow the positions in this attempt's saved order.
export function orderedOptions(question: Question, order: readonly OptionId[] = optionIds) {
  return order.map((id, index) => ({ ...question.options.find(option => option.id === id)!, label: optionLabels[optionIds[index]] }));
}
