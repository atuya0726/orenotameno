import { sc2025AutumnA1 } from './sc-2025-autumn-a1';

export const questions = sc2025AutumnA1;
export const questionById = new Map(questions.map(question => [question.id, question]));
export const courses = {
  A1: { name: '科目A1', legacy: '旧 午前Ⅰ', subtitle: 'ITの基礎を、確かな土台に。', description: '令和7年度秋期 午前Ⅰの実問題 全30問', minutes: 50 },
  A2: { name: '科目A2', legacy: '旧 午前Ⅱ', subtitle: 'セキュリティの理解を、一段深く。', description: '実問題は未収録です。追加までお待ちください。', minutes: 40 },
};
