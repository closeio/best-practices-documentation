import CryptoJS from 'crypto-js';
import type BestPractice from '../BestPractice';

/**
 * Generate a digest for the docs.
 *
 * Used to determine if the docs need to be updated or not.
 */
export const getBestPracticesDigest = (bestPractices: BestPractice[]) => {
  const message = JSON.stringify(bestPractices.map((bp) => bp.toPOJO()));
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
};
