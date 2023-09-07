import path from 'path';
import BestPractice from '../BestPractice';
import { isDocFile, readFileLines, walk, writeFileLines } from './fs';

/**
 * Scan through a directory looking for places to insert best practices.
 */
export const replaceAllBestPracticesInDocs = async (
  docsRoot: string,
  bestPractices: BestPractice[],
  getBestPracticeLines: (bestPracitce: BestPractice) => string[],
): Promise<Set<string>> => {
  const index = new Map(
    bestPractices
      .filter((bp) => Boolean(bp.meta.id))
      .map((bp) => [bp.getMeta('id'), bp]),
  );
  const insertedIds: string[] = [];

  if (index.size === 0) {
    return new Set(insertedIds);
  }

  for await (const filename of walk(docsRoot)) {
    if (isDocFile(filename)) {
      const inserted = await insertBestPracticesIntoDoc(
        path.join(docsRoot, filename),
        index,
        getBestPracticeLines,
      );
      insertedIds.push(...inserted);
    }
  }

  return new Set(insertedIds);
};

/**
 * Scan through a static documentation file and replace best practices lines
 */
export const insertBestPracticesIntoDoc = async (
  filename: string,
  index: Map<string, BestPractice>,
  getBestPracticeLines: (bestPracitce: BestPractice) => string[],
): Promise<Set<string>> => {
  const oldLines = await readFileLines(filename);
  const [newLines, insertedIds] = replaceBestPractices(
    filename,
    oldLines,
    index,
    getBestPracticeLines,
  );
  await writeFileLines(filename, newLines);
  return new Set(insertedIds);
};

/**
 * Given lines from a file, return new lines with best practices inserted.
 */
export const replaceBestPractices = (
  filename: string,
  lines: string[],
  index: Map<string, BestPractice>,
  getBestPracticeLines: (bestPractices: BestPractice) => string[],
): [newLines: string[], insertedIds: Set<string>] => {
  const [startRe, endRe] = getInsertREs(filename);
  let inBestPractice = false;
  let lineNumber = 0;

  const newLines: string[] = [];
  const insertedIds: string[] = [];

  for (const line of lines) {
    lineNumber += 1;

    if (inBestPractice) {
      if (endRe.test(line)) {
        inBestPractice = false;
        // Do not continue, we want to write out the end line
      } else {
        continue;
      }
    }

    newLines.push(line);

    if (startRe.test(line)) {
      inBestPractice = true;

      const [, bestPracticeId] = startRe.exec(line)!;

      if (!index.has(bestPracticeId)) {
        throw new Error(
          `Missing best practice: file ${filename} at line ${lineNumber} expects best practice ID: ${bestPracticeId}. No best practice with this ID was found.`,
        );
      }

      newLines.push(...getBestPracticeLines(index.get(bestPracticeId)!));
      insertedIds.push(bestPracticeId);
    }
  }

  return [newLines, new Set(insertedIds)];
};

/**
 * Get the regexp to match insertion comments in a documentation file.
 *
 * .mdx files use jsx comments rather than html comments.
 */
const getInsertREs = (filename: string): [start: RegExp, end: RegExp] => {
  if (/\.mdx$/.test(filename)) {
    return [MDX_INSERT_START_RE, MDX_INSERT_END_RE];
  }
  return [MD_INSERT_START_RE, MD_INSERT_END_RE];
};

const MD_INSERT_START_RE = /^\s*<!-- @BestPractice.insert (\S+) -->$/;
const MD_INSERT_END_RE = /^\s*<!-- @BestPractice.end -->$/;
const MDX_INSERT_START_RE = /^\s*{\/\* @BestPractice.insert (\S+) \*\/}$/;
const MDX_INSERT_END_RE = /^\s*{\/\* @BestPractice.end \*\/}$/;
