import { describe, expect, test } from 'vitest';
import { getAllBestPractices } from './parse';

describe(getAllBestPractices, () => {
  test('pulls out all of the best practices information correctly', async () => {
    const result = await getAllBestPractices('./tests/fixtures');
    expect(result.map((bp) => bp.toPOJO())).toEqual([
      {
        codeLines: ['      {Boolean(body) && <p>{body}</p>}'],
        endLine: 19,
        meta: {
          description: [
            'Make sure your conditional render checks are booleans.',
          ],
          subtitle: ['Conditional Rendering'],
          title: ['React Components'],
        },
        sourceFilename: 'sampleCodeFile.tsx',
        startLine: 15,
      },
      {
        codeLines: ['export default Card;'],
        endLine: 30,
        meta: {
          description: [
            'Put all exports, default and named, at the end of the file. This way you can always tell what',
            'is exported by the file by jumping to the bottom.',
          ],
          subtitle: ['Exports'],
          title: ['React Components'],
        },
        sourceFilename: 'sampleCodeFile.tsx',
        startLine: 24,
      },
      {
        codeLines: [
          'interface CardProps {',
          '  title: string;',
          '  body?: string;',
          '}',
        ],
        endLine: 9,
        meta: {
          description: [
            'Use interface over type, unless we need something specific that type supports but interface',
            "doesn't.",
          ],
          subtitle: ['Props'],
          title: ['React Components'],
        },
        sourceFilename: 'sampleCodeFile.tsx',
        startLine: 0,
      },
    ]);
  });
});
