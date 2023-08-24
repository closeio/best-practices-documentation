import { readFile } from 'fs/promises';
import path from 'path';
import { getBestPracticesDigest } from '../utils/digest';
import { pathExists } from '../utils/fs';
import { getAllBestPractices } from '../utils/parse';
import { DIGEST_FILENAME } from './consts';

type CheckArgs = {
  srcPath: string;
  destPath: string;
};

/**
 * Compare the digest of the best practices against the stored digest to
 * see if the docs need to be updated.
 */
const checkAction = async ({ srcPath, destPath }: CheckArgs) => {
  const bestPractices = await getAllBestPractices(srcPath);

  const currentDigest = getBestPracticesDigest(bestPractices);
  const previousDigest = await getPreviousBestPracticesDigest(destPath);

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
const getPreviousBestPracticesDigest = async (destPath: string) => {
  const digestPath = path.join(destPath, DIGEST_FILENAME);

  if (!(await pathExists(digestPath))) {
    return '';
  }

  const text = await readFile(digestPath, { encoding: 'utf8' });

  return text.trim();
};

export default checkAction;
