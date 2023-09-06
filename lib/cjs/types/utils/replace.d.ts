import BestPractice from '../BestPractice';
/**
 * Scan through a directory looking for places to insert best practices.
 */
export declare const replaceAllBestPracticesInDocs: (docsRoot: string, bestPractices: BestPractice[], getBestPracticeLines: (bestPracitce: BestPractice) => string[]) => Promise<Set<string>>;
/**
 * Scan through a static documentation file and replace best practices ines
 */
export declare const insertBestPracticesIntoDoc: (filename: string, index: Map<string, BestPractice>, getBestPracticeLines: (bestPracitce: BestPractice) => string[]) => Promise<Set<string>>;
/**
 * Given lines from a file, return new lines with best practices inserted.
 */
export declare const replaceBestPractices: (filename: string, lines: string[], index: Map<string, BestPractice>, getBestPracticeLines: (bestPractices: BestPractice) => string[]) => [newLines: string[], insertedIds: Set<string>];
//# sourceMappingURL=replace.d.ts.map