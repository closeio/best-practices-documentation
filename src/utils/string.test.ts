import { describe, expect, test } from 'vitest';
import { unindent } from './string';

describe(unindent, () => {
  test('does nothing when one line has no indentation', () => {
    expect(
      unindent([
        'const add = (a: number, b: number): number => {',
        '  return a + b',
        '}',
      ]),
    ).toEqual([
      'const add = (a: number, b: number): number => {',
      '  return a + b',
      '}',
    ]);
  });

  test('removes common indentation', () => {
    expect(
      unindent([
        '        const add = (a: number, b: number): number => {',
        '          return a + b',
        '        }',
      ]),
    ).toEqual([
      'const add = (a: number, b: number): number => {',
      '  return a + b',
      '}',
    ]);
  });
});
