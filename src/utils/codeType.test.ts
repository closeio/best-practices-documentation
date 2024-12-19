import { describe, expect, test } from 'vitest';
import { buildCodeTypeMap } from './codeType';

describe('buildCodeTypeMap', () => {
  test('builds correct mapper', () => {
    const mapper = buildCodeTypeMap(['jsx:js', 'tsx:ts']);
    expect(mapper('jsx')).toBe('js');
    expect(mapper('tsx')).toBe('ts');
    expect(mapper('js')).toBe('js');
    expect(mapper('ts')).toBe('ts');
  });

  test('correctly handles undefined mappings', () => {
    const mapper = buildCodeTypeMap();
    expect(mapper('jsx')).toBe('jsx');
    expect(mapper('tsx')).toBe('tsx');
    expect(mapper('js')).toBe('js');
    expect(mapper('ts')).toBe('ts');
  });
});
