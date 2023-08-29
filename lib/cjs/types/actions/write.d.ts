import BestPractice from '../BestPractice';
type WriteOptions = {
    writeExtraMeta?: boolean;
};
type WriteArgs = {
    srcPath: string;
    docsPath?: string;
    generatedPath: string;
    codeUrl: string;
    options: WriteOptions;
};
/**
 * Generate best practices from source and write them out.
 */
export default function writeAction({ srcPath, docsPath, generatedPath, codeUrl, options, }: WriteArgs): Promise<BestPractice[]>;
/**
 * Writes best practices out to md doc files.
 */
export declare const writeBestPractices: (contentDir: string, bestPractices: BestPractice[], codeUrl: string, options: WriteOptions) => Promise<void>;
export declare const SPECIAL_META_KEYS: Set<string>;
type WriteBestPracticeOptions = {
    writeTitle?: boolean;
    writeExtraMeta?: boolean;
};
/**
 * Generate best practice lines.
 */
export declare function getBestPracticeFileLines(bestPractice: BestPractice, codeUrl: string, { writeTitle, writeExtraMeta }: WriteBestPracticeOptions): Generator<string>;
export {};
//# sourceMappingURL=write.d.ts.map