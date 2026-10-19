import type { Course, Question } from '@/lib/model';

// Groups each question's topic into the exam's field structure, so practice can be chosen by field.
// Every topic used in the data must appear exactly once per course (checked by fields.test.ts).
export type Field = { id: string; name: string; topics: readonly string[] };
export type FieldGroup = { name: string; fields: readonly Field[] };

export const fieldGroups: Record<Course, readonly FieldGroup[]> = {
  A1: [
    { name: 'テクノロジ系', fields: [
      { id: 'basic', name: '基礎理論', topics: ['基礎理論', 'アルゴリズム', 'AI・機械学習'] },
      { id: 'computer', name: 'コンピュータシステム', topics: ['コンピュータ構成', 'システム構成', 'ソフトウェア', '組込みシステム'] },
      { id: 'hci', name: 'ヒューマンインタフェース・マルチメディア', topics: ['ヒューマンインタフェース', 'Web技術'] },
      { id: 'database', name: 'データベース', topics: ['データベース'] },
      { id: 'network', name: 'ネットワーク', topics: ['ネットワーク'] },
      { id: 'security', name: 'セキュリティ', topics: ['セキュリティ', 'セキュリティ管理', 'ネットワークセキュリティ', '暗号・認証'] },
      { id: 'development', name: '開発技術', topics: ['開発技術', 'ソフトウェア設計', '開発管理'] },
    ] },
    { name: 'マネジメント系', fields: [
      { id: 'project', name: 'プロジェクトマネジメント', topics: ['プロジェクト管理'] },
      { id: 'service', name: 'サービスマネジメント', topics: ['サービス管理'] },
      { id: 'audit', name: 'システム監査', topics: ['システム監査'] },
    ] },
    { name: 'ストラテジ系', fields: [
      { id: 'system-strategy', name: 'システム戦略', topics: ['システム戦略'] },
      { id: 'business-strategy', name: '経営戦略', topics: ['経営戦略', '技術戦略'] },
      { id: 'corporate', name: '企業と法務', topics: ['企業活動', '経営管理', '生産管理', '法務'] },
    ] },
  ],
  A2: [
    { name: 'セキュリティ', fields: [
      { id: 'crypto', name: '暗号・認証', topics: ['暗号', '認証', 'PKI'] },
      { id: 'attack', name: '攻撃手法', topics: ['攻撃手法', 'AIセキュリティ'] },
      { id: 'security-management', name: 'セキュリティ管理', topics: ['セキュリティ組織', 'セキュリティ監視'] },
      { id: 'security-implementation', name: 'セキュリティ実装技術', topics: ['ネットワークセキュリティ', 'Webセキュリティ', 'クラウドセキュリティ'] },
    ] },
    { name: 'その他の分野', fields: [
      { id: 'network', name: 'ネットワーク', topics: ['ネットワーク', 'Web技術'] },
      { id: 'database', name: 'データベース', topics: ['データベース'] },
      { id: 'development', name: '開発技術', topics: ['ソフトウェア開発'] },
      { id: 'service', name: 'サービスマネジメント', topics: ['サービスマネジメント'] },
      { id: 'audit', name: 'システム監査', topics: ['システム監査'] },
      { id: 'law', name: '法務', topics: ['法務'] },
    ] },
  ],
};

export function fieldsOf(course: Course): Field[] {
  return fieldGroups[course].flatMap(group => group.fields);
}
export function fieldIdOf(question: Pick<Question, 'course' | 'topic'>): string | undefined {
  return fieldsOf(question.course).find(field => field.topics.includes(question.topic))?.id;
}
