import { describe, expect, test } from 'vitest';
import { mockBestPractice } from '../../tests/mocks/bestPractice';
import { buildCodeTypeMap } from '../utils/codeType';
import { getBestPracticeFileLines } from './write';

describe(getBestPracticeFileLines, () => {
  test('writes out lines as expected', () => {
    const bestPractice = mockBestPractice({});

    const codeUrl =
      'https://github.com/closeio/best-practices-documentation/tree/main/src';
    const lines = [
      ...getBestPracticeFileLines(
        bestPractice,
        codeUrl,
        buildCodeTypeMap(['ts:typescript']),
        {},
      ),
    ];
    expect(lines).toEqual([
      '---',
      'title: A Best Practice',
      '---',
      '### The Specifics',
      'This is line one of the description.',
      'And this is line 2!',
      '',
      '```typescript',
      'const add = (a: number) => (b: number) => {',
      '  return a + b;',
      '};',
      'return add(5);',
      '```',
      `From [someFile.ts lines 10-18](${codeUrl}/someFile.ts#L10-L18)`,
    ]);
  });
});
