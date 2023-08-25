import { describe, expect, test } from 'vitest';
import BestPractice from '../BestPractice';
import { writeBestPractice } from './write';

describe(writeBestPractice, () => {
  test('writes out lines as expected', () => {
    const bestPractice = new BestPractice('someFile.ts');
    bestPractice.startLine = 10;
    bestPractice.endLine = 18;
    bestPractice.meta.title = ['A Best Practice'];
    bestPractice.meta.subtitle = ['The Specifics'];
    bestPractice.meta.description = [
      '  This is line one of the description.',
      '  And this is line 2!',
    ];
    bestPractice.meta.id = ['bp-001'];
    bestPractice.codeLines = [
      '  const add = (a: number) => (b: number) => {',
      '    return a + b;',
      '  };',
      '  return add(5);',
    ];

    const codeUrl =
      'https://github.com/closeio/best-practices-documentation/tree/main/src';
    const lines = [...writeBestPractice(bestPractice, codeUrl, {})];
    expect(lines).toEqual([
      '---',
      'title: A Best Practice',
      '---',
      '## id',
      'bp-001',
      '### The Specifics',
      'This is line one of the description.',
      'And this is line 2!',
      '',
      `[someFile.ts lines 10-18](${codeUrl}/someFile.ts#L10-L18)`,
      '```ts',
      'const add = (a: number) => (b: number) => {',
      '  return a + b;',
      '};',
      'return add(5);',
      '```',
    ]);
  });
});
