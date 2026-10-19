import { describe, expect, it } from 'vitest';
import { questions } from './questions';
import { fieldGroups, fieldIdOf, fieldsOf } from './fields';

describe('practice fields', () => {
  it('places every question in exactly one field of its course', () => {
    for (const question of questions) {
      const matches = fieldsOf(question.course).filter(field => field.topics.includes(question.topic));
      expect(matches.map(field => field.id), `${question.id}: ${question.topic}`).toHaveLength(1);
    }
  });
  it('keeps field ids and topics unique within a course', () => {
    for (const course of ['A1', 'A2'] as const) {
      const fields = fieldsOf(course);
      expect(new Set(fields.map(field => field.id)).size).toBe(fields.length);
      const topics = fields.flatMap(field => field.topics);
      expect(new Set(topics).size).toBe(topics.length);
      expect(fieldGroups[course].every(group => group.fields.length > 0)).toBe(true);
    }
    expect(fieldIdOf({ course: 'A1', topic: 'プロジェクト管理' })).toBe('project');
  });
});
