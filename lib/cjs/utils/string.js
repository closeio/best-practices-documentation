"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unindent = void 0;
/**
 * Removes indentation from code lines.
 */
const unindent = (lines) => {
    let indent = -1;
    for (const line of lines) {
        const [, leadingSpace] = /^(\s*)/.exec(line);
        if (indent === -1) {
            indent = leadingSpace.length;
        }
        else {
            indent = Math.min(indent, leadingSpace.length);
        }
    }
    return indent === 0 ? lines : lines.map((line) => line.slice(indent));
};
exports.unindent = unindent;
