import { type FileHandle } from 'fs/promises';
/**
 * Asynchronously walks through a directory structure and yields filenames.
 * Uses a depth-first search pattern.
 */
export declare function walk(dir: string, context?: string): AsyncGenerator<string>;
/**
 * Writes text to a file descriptor, adding a trailing newline.
 */
export declare const writeLine: (fd: FileHandle, line: string, newline?: string) => Promise<{
    bytesWritten: number;
    buffer: string;
}>;
/**
 * Checks to see if a file exists or not.
 */
export declare const pathExists: (filename: string) => Promise<boolean>;
export declare const isCodeFile: (filename: string) => boolean;
//# sourceMappingURL=fs.d.ts.map