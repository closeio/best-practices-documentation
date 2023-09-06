import BestPractice from '../../src/BestPractice';

type BestPracticeArgs = {
  filename?: string;
  startLine?: number;
  endLine?: number;
  title?: string[];
  subtitle?: string[];
  description?: string[];
  meta?: Record<string, string[]>;
  codeLines?: string[];
};

export const mockBestPractice = ({
  filename = 'someFile.ts',
  startLine = 10,
  endLine = 18,
  title = ['A Best Practice'],
  subtitle = ['The Specifics'],
  description = [
    '  This is line one of the description.',
    '  And this is line 2!',
  ],
  meta = {},
  codeLines = [
    '  const add = (a: number) => (b: number) => {',
    '    return a + b;',
    '  };',
    '  return add(5);',
  ],
}: BestPracticeArgs): BestPractice => {
  const bp = new BestPractice(filename);

  bp.startLine = startLine;
  bp.endLine = endLine;
  bp.meta.title = title;
  bp.meta.subtitle = subtitle;
  bp.meta.description = description;
  Object.entries(meta).forEach(([key, value]) => {
    bp.meta[key] = value;
  });
  bp.codeLines = codeLines;

  return bp;
};
