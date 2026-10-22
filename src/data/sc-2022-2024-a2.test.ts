import { describe, expect, it } from 'vitest';
import { questions } from './questions';
import { sc2024AutumnA2 } from './sc-2024-autumn-a2';
import { sc2024SpringA2 } from './sc-2024-spring-a2';
import { sc2023AutumnA2 } from './sc-2023-autumn-a2';
import { sc2023SpringA2 } from './sc-2023-spring-a2';
import { sc2022AutumnA2 } from './sc-2022-autumn-a2';
import { sc2022SpringA2 } from './sc-2022-spring-a2';
import { getQuestionTerms } from './question-terms';
import { optionLabels } from '@/lib/model';
import { termForWord } from '@/features/glossary/terms';

// 各年度のIPA公式am2_ans.pdfから、データ生成とは独立に問1〜25を転記。
const sets = [
  { key: '2024-autumn', data: sc2024AutumnA2, answers: 'アイイエウアアエエイアアエエエアイアイアエイエエウ', tables: [], figures: [], optionFigures: [], calculation: [], code: [] },
  { key: '2024-spring', data: sc2024SpringA2, answers: 'エアエアアエウエエアイエエエエアウアエイエアエウウ', tables: [21], figures: [], optionFigures: [24], calculation: [], code: [21] },
  { key: '2023-autumn', data: sc2023AutumnA2, answers: 'イアウアアエウイウイエイエイエイイエエアウウウウア', tables: [], figures: [17], optionFigures: [], calculation: [18], code: [] },
  { key: '2023-spring', data: sc2023SpringA2, answers: 'ウイアエウイアエイアアエアエアイエイイアアエウイエ', tables: [], figures: [], optionFigures: [], calculation: [18], code: [21] },
  { key: '2022-autumn', data: sc2022AutumnA2, answers: 'アエアイアウエアアエエエアウアアイエエエウアイエイ', tables: [21, 24], figures: [22], optionFigures: [], calculation: [24], code: [21] },
  { key: '2022-spring', data: sc2022SpringA2, answers: 'イエイアイエエイイアイウアエウイイアウエウアイウウ', tables: [12, 24], figures: [], optionFigures: [], calculation: [4, 24], code: [1] },
];

describe.each(sets)('$key A2の収録データ', ({ key, data, answers, tables, figures, optionFigures, calculation, code }) => {
  it('contains the complete 25-question set with official sources and original explanations', () => {
    expect(data).toHaveLength(25);
    expect(data.map(q => q.number)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    const [year, season] = key.split('-');
    for (const q of data) {
      expect(q.id).toBe(`sc-${key}-a2-${q.number}`);
      expect(q.course).toBe('A2');
      expect(q.options.map(o => o.id)).toEqual(['a', 'b', 'c', 'd']);
      expect(q.options.every(o => o.text.length > 0 && o.explanation.length > 0 && !o.explanation.includes('TODO'))).toBe(true);
      expect(q.explanation).not.toContain('TODO');
      expect(q.source).toMatchObject({ kind: 'ipa', year: Number(year), season, section: '午前Ⅱ', questionNumber: q.number });
      if (q.source.kind === 'ipa') expect(q.source.answerUrl).toContain(`${year}r${String(Number(year) - 2018).padStart(2, '0')}${season === 'autumn' ? 'a' : 'h'}_sc_am2_ans.pdf`);
      expect(getQuestionTerms(q).length).toBeGreaterThanOrEqual(4);
    }
  });

  it('matches the independent official answer sheet in original order', () => {
    expect(data.map(q => optionLabels[q.correct]).join('')).toBe(answers);
  });

  it('preserves figures, tables, code, and numerical problem classifications', () => {
    expect(data.filter(q => q.table).map(q => q.number)).toEqual(tables);
    expect(data.filter(q => q.figure).map(q => q.number)).toEqual(figures);
    expect(data.filter(q => q.options.some(o => o.figure)).map(q => q.number)).toEqual(optionFigures);
    expect(data.filter(q => q.code).map(q => q.number)).toEqual(code);
    expect(data.filter(q => q.kind === 'calculation').map(q => q.number)).toEqual(calculation);
    for (const q of data) {
      if (q.figure) expect(q.figure.svg).toContain('<title');
      for (const option of q.options) if (option.figure) expect(option.figure).toContain('currentColor');
    }
  });
});

describe('追加したA2の横断的な整合性', () => {
  it('offers 200 A2 questions without colliding ids across courses', () => {
    expect(questions.filter(q => q.course === 'A2')).toHaveLength(200);
    expect(questions.filter(q => q.course === 'A1')).toHaveLength(300);
    expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
  });

  it('preserves source values used by the SQL and ROI problems', () => {
    expect(sc2024SpringA2[20].table?.rows[1]).toEqual(['2', '総務部', '5', '28']);
    expect(sc2022AutumnA2[20].table?.rows).toEqual([
      ['R', 'A001', '10', '—'], ['R', 'A002', '20', '—'], ['R', 'A003', '30', '—'], ['R', 'A005', '50', '—'],
      ['S', 'A002', '—', '20'], ['S', 'A003', '—', '30'], ['S', 'A004', '—', '40'],
    ]);
    expect(sc2022AutumnA2[23].table?.rows).toEqual([
      ['A', '30', '4', '25'], ['B', '20', '6', '20'], ['C', '20', '4', '15'], ['D', '15', '5', '22'],
    ]);
    expect(sc2022SpringA2[23].table?.rows[0][1]).toContain('84時間');
    expect(sc2023AutumnA2[16].details?.items).toHaveLength(4);
    expect(sc2023AutumnA2[23].details?.items).toHaveLength(2);
  });

  it.each([
    ['RA', 'PKI'], ['サプリカント', 'オーセンティケータ'], ['EAP', 'IEEE 802.1X'], ['RADIUS', 'IEEE 802.1X'],
    ['OCSP', 'CRL'], ['共通鍵', '公開鍵'], ['公開鍵', '秘密鍵'], ['量子鍵配送', '量子暗号'],
    ['IT全般統制', 'IT業務処理統制'], ['総当たり攻撃', 'パスワードリスト攻撃'],
    ['プレースホルダ', 'SQLインジェクション'], ['ブロードキャスト', 'マルチキャスト'], ['無線LAN', 'PoE'],
    ['ROI', '投資評価手法'],
    ['Referer', 'CSRF'], ['L2TP', 'VPN'], ['外部キー', '参照制約'], ['候補キー', '主キー'],
    ['ARP', 'MACアドレス'], ['ハッシュ値', 'ハッシュ関数'], ['NTLM認証', 'Pass the Hash攻撃'],
    ['計画停止', 'サービス可用性'], ['排他的論理和', '論理演算'],
    ['電子政府推奨暗号リスト', 'CRYPTREC暗号リスト'], ['偵察', 'サイバーキルチェーン'],
  ])('opens %s as a separate learning concept from %s', (word, other) => {
    expect(termForWord(word)).toBeDefined();
    expect(termForWord(other)).toBeDefined();
    expect(termForWord(word)?.id).not.toBe(termForWord(other)?.id);
  });
});
