interface Metadata {
    title: string[];
    subtitle: string[];
    description: string[];
    [key: string]: string[];
}
type State = 'NOT_STARTED' | 'PREAMBLE' | 'DONE' | 'CODE';
/**
 * This class is a state machine used for parsing best practice tags and associated
 * code. Lines of code are fed to the class, and it will properly handle each line.
 * Once a best practice section is finished, the state will be set to 'DONE'.
 */
export default class BestPractice {
    sourceFilename: string;
    startLine: number | null;
    endLine: number | null;
    meta: Metadata;
    codeLines: string[];
    private stateMachine;
    constructor(sourceFilename: string);
    getFileType(): string;
    getState(): State;
    setState(state: State): void;
    getContext(): string | null;
    setContext(value: string): void;
    getMeta(key: string, joiner?: string): string;
    getTitle(): string;
    getSubtitle(): string;
    getFileInfo(extension?: string): {
        filepath: string[];
        filename: string;
    };
    toPOJO(): {
        sourceFilename: string;
        startLine: number | null;
        endLine: number | null;
        meta: Metadata;
        codeLines: string[];
    };
    /**
     * Compare this BestPractice instance against another for sorting. Sorts
     * first by title, then subtitle.
     */
    compare(other: BestPractice): number;
    /**
     * Parse a line from a file and decide what to do with it
     *
     * @param {number} lineNumber - the line number in the file where the line occurs
     * @param {string} line - the line from the file
     */
    parseLine(lineNumber: number, line: string): void;
}
export {};
//# sourceMappingURL=BestPractice.d.ts.map