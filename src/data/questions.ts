import { sc2025AutumnA1 } from './sc-2025-autumn-a1';
import { sc2025AutumnA2 } from './sc-2025-autumn-a2';
import { sc2025SpringA1 } from './sc-2025-spring-a1';
import { sc2024AutumnA1 } from './sc-2024-autumn-a1';
import { sc2024SpringA1 } from './sc-2024-spring-a1';
import { sc2023AutumnA1 } from './sc-2023-autumn-a1';
import { sc2023SpringA1 } from './sc-2023-spring-a1';

export const questions = [...sc2025AutumnA1, ...sc2025SpringA1, ...sc2024AutumnA1, ...sc2024SpringA1, ...sc2023AutumnA1, ...sc2023SpringA1, ...sc2025AutumnA2];
export const questionById = new Map(questions.map(question => [question.id, question]));
export const courses = {
  A1: { name: '科目A1', legacy: '旧 午前Ⅰ', subtitle: 'ITの基礎を、確かな土台に。', description: '令和5〜7年度 春期・秋期 午前Ⅰの実問題 全180問', minutes: 50 },
  A2: { name: '科目A2', legacy: '旧 午前Ⅱ', subtitle: 'セキュリティの理解を、一段深く。', description: '令和7年度秋期 午前Ⅱの実問題 全25問', minutes: 40 },
};
