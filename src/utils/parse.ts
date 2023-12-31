import path from 'path';
import BestPractice from '../BestPractice';
import { isCodeFile, readFileLines, walk } from './fs';

/**
 * Recursively walk the srcDir and pull best practices from all code files.
 */
export const getAllBestPractices = async (srcDir: string) => {
  const bestPractices: BestPractice[] = [];

  for await (const filename of walk(srcDir)) {
    if (isCodeFile(filename)) {
      const fileBestPractices = await getFileBestPractices(srcDir, filename);
      if (fileBestPractices.length !== 0) {
        bestPractices.push(...fileBestPractices);
      }
    }
  }

  bestPractices.sort((left, right) => left.compare(right));

  return bestPractices;
};

/**
 * Scan through the file at root/filename searching for best practices.
 */
export const getFileBestPractices = async (root: string, filename: string) => {
  const lines = await readFileLines(path.join(root, filename));

  const bestPractices = [new BestPractice(filename)];

  lines.forEach((line, index) => {
    const latest = bestPractices[bestPractices.length - 1];
    latest.parseLine(index + 1, line);
    if (latest.getState() === 'DONE') {
      bestPractices.push(new BestPractice(filename));
    }
  });

  return bestPractices.filter((bp) => bp.getState() !== 'NOT_STARTED');
};
