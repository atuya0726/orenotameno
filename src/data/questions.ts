import { sc2022AutumnA1 } from './sc-2022-autumn-a1';
import { sc2022SpringA1 } from './sc-2022-spring-a1';
import { sc2021AutumnA1 } from './sc-2021-autumn-a1';
import { sc2021SpringA1 } from './sc-2021-spring-a1';
import { sc2025AutumnA1 } from './sc-2025-autumn-a1';
import { sc2025SpringA1 } from './sc-2025-spring-a1';
import { sc2024AutumnA1 } from './sc-2024-autumn-a1';
import { sc2024SpringA1 } from './sc-2024-spring-a1';
import { sc2023AutumnA1 } from './sc-2023-autumn-a1';
import { sc2023SpringA1 } from './sc-2023-spring-a1';
import { sc2025AutumnA2 } from './sc-2025-autumn-a2';
import { sc2025SpringA2 } from './sc-2025-spring-a2';
import { sc2024AutumnA2 } from './sc-2024-autumn-a2';
import { sc2024SpringA2 } from './sc-2024-spring-a2';
import { sc2023AutumnA2 } from './sc-2023-autumn-a2';
import { sc2023SpringA2 } from './sc-2023-spring-a2';
import { sc2022AutumnA2 } from './sc-2022-autumn-a2';
import { sc2022SpringA2 } from './sc-2022-spring-a2';

export const questions = [
  ...sc2025AutumnA1, ...sc2025SpringA1, ...sc2024AutumnA1, ...sc2024SpringA1, ...sc2023AutumnA1, ...sc2023SpringA1, ...sc2022AutumnA1, ...sc2022SpringA1, ...sc2021AutumnA1, ...sc2021SpringA1,
  ...sc2025AutumnA2, ...sc2025SpringA2, ...sc2024AutumnA2, ...sc2024SpringA2, ...sc2023AutumnA2, ...sc2023SpringA2, ...sc2022AutumnA2, ...sc2022SpringA2,
];
export const questionById = new Map(questions.map(question => [question.id, question]));
export const courses = {
  A1: { name: '科目A1', legacy: '旧 午前Ⅰ', subtitle: 'ITの基礎を、確かな土台に。', description: '令和3〜7年度 春期・秋期 午前Ⅰの実問題 全300問', minutes: 50 },
  A2: { name: '科目A2', legacy: '旧 午前Ⅱ', subtitle: 'セキュリティの理解を、一段深く。', description: '令和4〜7年度 春期・秋期 午前Ⅱの実問題 全200問', minutes: 40 },
};
