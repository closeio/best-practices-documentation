import BestPractice from '../BestPractice';
type WriteOptions = {
    writeExtraMeta?: boolean;
};
type WriteArgs = {
    srcPath: string;
    destPath: string;
    codeUrl: string;
    options: WriteOptions;
};
/**
 * Generate best practices from source and write them out.
 */
export default function writeAction({ srcPath, destPath, codeUrl, options, }: WriteArgs): Promise<BestPractice[]>;
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
export declare function writeBestPractice(bestPractice: BestPractice, codeUrl: string, { writeTitle, writeExtraMeta }: WriteBestPracticeOptions): Generator<string>;
export {};
//# sourceMappingURL=write.d.ts.map