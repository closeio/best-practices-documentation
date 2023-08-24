import { mkdir, open, rm } from 'fs/promises';
import path from 'path';
import BestPractice from '../BestPractice';
import { getBestPracticesDigest } from '../utils/digest';
import { pathExists, writeLine } from '../utils/fs';
import { getAllBestPractices } from '../utils/parse';
import { unindent } from '../utils/string';
import { DIGEST_FILENAME } from './consts';

type WriteArgs = {
  srcPath: string;
  destPath: string;
  codeUrl: string;
};

/**
 * Generate best practices from source and write them out.
 */
export default async function writeAction({
  srcPath,
  destPath,
  codeUrl,
}: WriteArgs) {
  const bestPractices = await getAllBestPractices(srcPath);

  await writeBestPractices(destPath, codeUrl, bestPractices);
  await writeBestPracticesDigest(
    destPath,
    getBestPracticesDigest(bestPractices),
  );

  return bestPractices;
}

/**
 * Writes best practices out to md doc files.
 */
export const writeBestPractices = async (
  contentDir: string,
  codeUrl: string,
  bestPractices: BestPractice[],
) => {
  try {
    await rm(contentDir, { recursive: true });
  } catch {
    // Do nothing
  }

  await mkdir(contentDir);

  for (const bestPractice of bestPractices) {
    await writeBestPracticeToFile(contentDir, codeUrl, bestPractice);
  }
};

export const SPECIAL_META_KEYS = new Set(['title', 'subtitle', 'description']);

const writeBestPracticeToFile = async (
  dir: string,
  codeUrl: string,
  bestPractice: BestPractice,
) => {
  const { filepath, filename } = bestPractice.getFileInfo();
  const dirpath = path.join(dir, ...filepath);
  const fullpath = path.join(dirpath, filename);

  const dirExists = await pathExists(dirpath);
  const fileExists = await pathExists(fullpath);
  const writeTitle = !fileExists;

  let fd;

  try {
    if (!dirExists) {
      await mkdir(dirpath, { recursive: true });
    }

    fd = await open(fullpath, 'a');
    for (const line of writeBestPractice(codeUrl, bestPractice, writeTitle)) {
      await writeLine(fd, line);
    }
  } finally {
    fd?.close();
  }
};

/**
 * Wite a best practice md file to the given directory
 *
 * @param {string} dir - the directory to write the best practice md file
 * @param {BestPractice} bestPractice - the best practice to write.
 */
function* writeBestPractice(
  codeUrl: string,
  bestPractice: BestPractice,
  writeTitle: boolean,
): Generator<string> {
  if (writeTitle) {
    yield '---';
    yield `title: ${bestPractice.getTitle()}`;
    yield '---';
  }

  for (const [key, lines] of Object.entries(bestPractice.meta)) {
    if (SPECIAL_META_KEYS.has(key)) {
      continue;
    }

    yield `## ${key}`;

    for (const line of lines) {
      yield line;
    }
  }

  // If given, write the subtitle as a single line
  if (bestPractice.getSubtitle()) {
    yield `### ${bestPractice.getSubtitle()}`;
  }

  // If given, write out the description lines
  const description = bestPractice.getMeta('description');
  if (description) {
    yield description;
    yield '';
  }

  const { sourceFilename, startLine, endLine } = bestPractice;
  const url = `${codeUrl}/${sourceFilename}#L${startLine}-L${endLine}`;
  yield `[${sourceFilename} lines ${startLine}-${endLine}](${url})`;
  yield `\`\`\`${bestPractice.getFileType()}`;

  for (const line of unindent(bestPractice.codeLines)) {
    yield line;
  }

  yield '```';
}

/**
 * Write the digest for best practices.
 */
const writeBestPracticesDigest = async (destPath: string, digest: string) => {
  const digestPath = path.join(destPath, DIGEST_FILENAME);
  let fd;

  try {
    fd = await open(digestPath, 'w');
    await writeLine(fd, digest);
  } finally {
    await fd?.close();
  }
};
