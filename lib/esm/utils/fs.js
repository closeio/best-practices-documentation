"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocFile = exports.isCodeFile = exports.writeFileLines = exports.readFileLines = exports.pathExists = exports.writeLine = void 0;
exports.walk = walk;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const promises_2 = require("fs/promises");
const path_1 = require("path");
/**
 * Asynchronously walks through a directory structure and yields filenames.
 * Uses a depth-first search pattern.
 */
async function* walk(dir, context = '') {
    const entries = await (0, promises_2.readdir)(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const next = await walk((0, path_1.join)(dir, entry.name), (0, path_1.join)(context, entry.name));
            yield* next;
        }
        else {
            yield (0, path_1.join)(context, entry.name);
        }
    }
}
/**
 * Writes text to a file descriptor, adding a trailing newline.
 */
const writeLine = (fd, line, newline = '\n') => fd.write(`${line}${newline}`);
exports.writeLine = writeLine;
/**
 * Checks to see if a file exists or not.
 */
const pathExists = async (filename) => {
    try {
        await (0, promises_2.access)(filename, fs_1.constants.F_OK);
    }
    catch {
        return false;
    }
    return true;
};
exports.pathExists = pathExists;
const readFileLines = async (filename) => {
    const text = await (0, promises_1.readFile)(filename, { encoding: 'utf8' });
    return text.split('\n');
};
exports.readFileLines = readFileLines;
const writeFileLines = async (filename, lines) => {
    return (0, promises_1.writeFile)(filename, lines.map((line) => `${line}\n`));
};
exports.writeFileLines = writeFileLines;
const isCodeFile = (filename) => /\.(js|jsx|ts|tsx)$/i.test(filename);
exports.isCodeFile = isCodeFile;
const isDocFile = (filename) => /\.mdx?$/i.test(filename);
exports.isDocFile = isDocFile;
