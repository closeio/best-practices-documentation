import { describe, expect, test } from 'vitest';
import { mockBestPractice } from '../../tests/mocks/bestPractice';
import BestPractice from '../BestPractice';
import { replaceBestPractices } from './replace';

describe(replaceBestPractices, () => {
  test('replaces best practices correctly', () => {
    const getBestPracticeLines = (bestPractice: BestPractice) => {
      return [
        `\`\`\`${bestPractice.getFileType()}`,
        ...bestPractice.codeLines,
        '```',
      ];
    };

    const bestPractices = [
      mockBestPractice({ meta: { id: ['sample_id_1'] } }),
      mockBestPractice({
        codeLines: ['const c = a + b'],
        meta: { id: ['sample_id_2'] },
      }),
    ];
    const index = new Map(bestPractices.map((bp) => [bp.getMeta('id'), bp]));

    const oldLines = [
      '## A Title',
      '',
      "Hello and here's the thing.",
      '',
      '<!-- @BestPractice.insert sample_id_1 -->',
      'this is',
      'lines that were',
      'inserted before',
      '<!-- @BestPractice.end -->',
      '',
      "And here's some stuff after",
    ];

    const [newLines, insertedIds] = replaceBestPractices(
      'someDocumentation.md',
      oldLines,
      index,
      getBestPracticeLines,
    );

    expect(newLines).toEqual([
      '## A Title',
      '',
      "Hello and here's the thing.",
      '',
      '<!-- @BestPractice.insert sample_id_1 -->',
      '```ts',
      '  const add = (a: number) => (b: number) => {',
      '    return a + b;',
      '  };',
      '  return add(5);',
      '```',
      '<!-- @BestPractice.end -->',
      '',
      "And here's some stuff after",
    ]);

    expect(insertedIds).toEqual(new Set(['sample_id_1']));
  });
});
