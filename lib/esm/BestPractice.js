"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class is a state machine used for parsing best practice tags and associated
 * code. Lines of code are fed to the class, and it will properly handle each line.
 * Once a best practice section is finished, the state will be set to 'DONE'.
 */
class BestPractice {
    sourceFilename;
    startLine;
    endLine;
    meta;
    codeLines;
    stateMachine;
    constructor(sourceFilename) {
        this.sourceFilename = sourceFilename;
        this.startLine = null;
        this.endLine = null;
        this.meta = {
            title: [],
            subtitle: [],
            description: [],
        };
        this.codeLines = [];
        this.stateMachine = {
            state: 'NOT_STARTED',
            context: null,
        };
    }
    getFileType() {
        const parts = this.sourceFilename.split('.');
        return parts[parts.length - 1];
    }
    getState() {
        return this.stateMachine.state;
    }
    setState(state) {
        this.stateMachine.state = state;
    }
    getContext() {
        return this.stateMachine.context;
    }
    setContext(value) {
        this.stateMachine.context = value;
    }
    getMeta(key, joiner = '\n') {
        return this.meta[key]?.join(joiner);
    }
    getTitle() {
        return this.getMeta('title', ' ');
    }
    getSubtitle() {
        return this.getMeta('subtitle', ' ');
    }
    getFileInfo(extension = '.md') {
        const title = this.getTitle();
        if (!title) {
            throw new Error(`No title found for best practice ${this.sourceFilename}:${this.startLine}`);
        }
        const canonical = this.getTitle().split('/').map(toPathSafeString);
        const filepath = canonical.slice(0, -1);
        const filename = canonical[canonical.length - 1];
        return { filepath, filename: `${filename}${extension}` };
    }
    toPOJO() {
        return {
            sourceFilename: this.sourceFilename,
            startLine: this.startLine,
            endLine: this.endLine,
            meta: this.meta,
            codeLines: this.codeLines,
        };
    }
    /**
     * Compare this BestPractice instance against another for sorting. Sorts
     * first by title, then subtitle.
     */
    compare(other) {
        const leftTitle = toPathSafeString(this.getTitle() ?? '');
        const rightTitle = toPathSafeString(other.getTitle() ?? '');
        const value = leftTitle.localeCompare(rightTitle);
        if (value !== 0) {
            return value;
        }
        const leftSubtitle = toPathSafeString(this.getSubtitle() ?? '');
        const rightSubtitle = toPathSafeString(other.getSubtitle() ?? '');
        return leftSubtitle.localeCompare(rightSubtitle);
    }
    /**
     * Parse a line from a file and decide what to do with it
     *
     * @param {number} lineNumber - the line number in the file where the line occurs
     * @param {string} line - the line from the file
     */
    parseLine(lineNumber, line) {
        if (this.getState() !== 'NOT_STARTED') {
            this.endLine = lineNumber;
        }
        if (isStartLine(line)) {
            if (this.getState() !== 'NOT_STARTED') {
                throw new Error('Cannot re-start a best practice');
            }
            this.startLine = lineNumber;
            this.endLine = lineNumber;
            const [, title] = START_RE.exec(line);
            this.setContext('title');
            this.meta.title.push(title.trim());
            this.setState('PREAMBLE');
        }
        else if (isEndLine(line)) {
            if (this.getState() !== 'CODE') {
                throw new Error('Cannot end a best practice before the code section');
            }
            this.setState('DONE');
        }
        else if (isMetaLine(line)) {
            if (this.getState() !== 'PREAMBLE') {
                throw new Error('Cannot add meta content outside of preamble');
            }
            const [subject, content] = splitMeta(line);
            this.setContext(subject);
            if (!this.meta[subject]) {
                this.meta[subject] = [];
            }
            if (content) {
                this.meta[subject].push(content.trim());
            }
        }
        else if (isCommentLine(line)) {
            if (this.getState() === 'NOT_STARTED') {
                return;
            }
            if (this.getState() === 'CODE') {
                this.codeLines.push(line);
            }
            else if (this.getState() === 'PREAMBLE') {
                const context = this.getContext();
                if (context) {
                    this.meta[context].push((getMeta(line) ?? '').trim());
                }
            }
        }
        else {
            if (this.getState() === 'NOT_STARTED') {
                return;
            }
            if (this.getState() === 'PREAMBLE') {
                this.setState('CODE');
            }
            this.codeLines.push(line);
        }
    }
}
exports.default = BestPractice;
const START_RE = /^\s*(?:\/\/|{\/\*) @BestPractice\s+(\S.*?)(?:\*\/})?$/;
const END_RE = /^\s*(?:\/\/|{\/\*) @BestPractice.end/;
const META_RE = /^\s*(?:\/\/|{\/\*) @BestPractice.(?!end)(\S+)(.*?)(?:\*\/})?$/;
const COMMENT_RE = /^\s*(?:\/\/|{\/\*)(.*?)(?:\*\/})?$/;
const isStartLine = (line) => START_RE.test(line);
const isEndLine = (line) => END_RE.test(line);
const isMetaLine = (line) => META_RE.test(line);
const isCommentLine = (line) => COMMENT_RE.test(line);
const splitMeta = (line) => {
    const [, key, value] = META_RE.exec(line);
    return [key, value];
};
const toPathSafeString = (value) => value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9-]/gi, '')
    .toLowerCase();
const getMeta = (line) => COMMENT_RE.exec(line)[1];
