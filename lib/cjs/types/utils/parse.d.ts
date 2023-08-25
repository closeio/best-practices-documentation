import BestPractice from '../BestPractice';
/**
 * Recursively walk the srcDir and pull best practices from all code files.
 */
export declare const getAllBestPractices: (srcDir: string) => Promise<BestPractice[]>;
/**
 * Scan through the file at root/filename searching for best practices.
 */
export declare const getFileBestPractices: (root: string, filename: string) => Promise<BestPractice[]>;
//# sourceMappingURL=parse.d.ts.map