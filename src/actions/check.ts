import { readFile } from 'fs/promises';
import path from 'path';
import type BestPractice from '../BestPractice';
import { getBestPracticesDigest } from '../utils/digest';
import { pathExists } from '../utils/fs';
import { getAllBestPractices } from '../utils/parse';
import { DIGEST_FILENAME } from './consts';

type CheckArgs = {
  srcPath: string[];
  generatedPath: string;
};

/**
 * Compare the digest of the best practices against the stored digest to
 * see if the docs need to be updated.
 */
const checkAction = async ({ srcPath: srcPaths, generatedPath }: CheckArgs) => {
  const allBestPractices: BestPractice[] = [];

  for (const srcPath of srcPaths) {
    const bestPractices = await getAllBestPractices(srcPath);
    allBestPractices.push(...bestPractices);
  }

  const currentDigest = getBestPracticesDigest(allBestPractices);
  const previousDigest = await getPreviousBestPracticesDigest(generatedPath);

  if (currentDigest === previousDigest) {
    return;
  }

  console.error(
    `Best practices documentation is not up to date. Please rebuild and commit the changes`,
  );

  process.exit(1);
};

/**
 * Get the stored digest for best practices.
 */
const getPreviousBestPracticesDigest = async (generatedPath: string) => {
  const digestPath = path.join(generatedPath, DIGEST_FILENAME);

  if (!(await pathExists(digestPath))) {
    return '';
  }

  const text = await readFile(digestPath, { encoding: 'utf8' });

  return text.trim();
};

export default checkAction;
