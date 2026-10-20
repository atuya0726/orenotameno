import type { Question } from './model';

// Only group choices when every choice has the same ordered, named fields.
// Commas inside a value (for example, T2，T5) belong to that value.
export function getCombinationOptions(options: Question['options']) {
  if (!options.length || options.some(option => option.figure)) return null;
  const rows = options.map(option => {
    const fields = [...option.text.matchAll(/(?:^|[，　]|(?<=。))([^，　：。]+)：/gu)];
    if (fields.length < 2 || fields[0].index !== 0) return null;
    return {
      id: option.id,
      headers: fields.map(field => field[1].trim()),
      values: fields.map((field, i) => option.text
        .slice(field.index! + field[0].length, fields[i + 1]?.index)
        .trim()),
    };
  });
  const first = rows[0];
  if (!first || new Set(first.headers).size !== first.headers.length) return null;
  if (rows.some(row => !row || row.headers.length !== first.headers.length
    || row.headers.some((header, i) => header !== first.headers[i])
    || row.values.some(value => !value))) return null;
  return { headers: first.headers, rows: rows.filter(row => row !== null) };
}
