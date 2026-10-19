import type { Course, OptionId, Question } from '@/lib/model';

// One IPA exam section (e.g. 令和7年度秋期 午前Ⅱ). Answers follow the official answer sheet in question order.
export type IpaQuestionSet = {
  idPrefix: string; examId: string; course: Course; year: number; season: 'autumn' | 'spring';
  section: string; examName: string; questionUrl: string; answerUrl: string; listingUrl: string;
  answers: OptionId[]; calculation: number[];
};

const seasonNames = { autumn: '秋期', spring: '春期' };
export function eraLabel(set: Pick<IpaQuestionSet, 'year' | 'season'>): string {
  return `令和${set.year - 2018}年度${seasonNames[set.season]}`;
}

export function ipaQuestion(set: IpaQuestionSet, number: number, topic: string, title: string, prompt: string, choices: [string, string][], explanation: string, extra: Pick<Question, 'details' | 'table'> = {}): Question {
  return {
    id: `${set.idPrefix}-${number}`, examId: set.examId, course: set.course, number, topic, title, prompt,
    // 数値や式を求める問題。表の有無やキーワードでは判定しない。
    kind: set.calculation.includes(number) ? 'calculation' : 'knowledge',
    options: choices.map(([text, explanation], i) => ({ id: (['a', 'b', 'c', 'd'] as const)[i], text, explanation })),
    correct: set.answers[number - 1], explanation, ...extra,
    source: {
      kind: 'ipa', label: `出典：${eraLabel(set).replace('度', '度 ')} ${set.examName} ${set.section} 問${number}`,
      year: set.year, season: set.season, section: set.section, questionNumber: number,
      questionUrl: set.questionUrl, answerUrl: set.answerUrl, listingUrl: set.listingUrl,
      adaptationNote: '空白・句読点・数式の表記を整え、図表をHTMLで再構成しています。解説は当サイト独自のものです。',
    },
  };
}
