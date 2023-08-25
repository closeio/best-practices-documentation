"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCodeFile = exports.pathExists = exports.writeLine = exports.walk = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
/**
 * Asynchronously walks through a directory structure and yields filenames.
 * Uses a depth-first search pattern.
 */
async function* walk(dir, context = '') {
    const entries = await (0, promises_1.readdir)(dir, { withFileTypes: true });
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
exports.walk = walk;
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
        await (0, promises_1.access)(filename, fs_1.constants.F_OK);
    }
    catch {
        return false;
    }
    return true;
};
exports.pathExists = pathExists;
const isCodeFile = (filename) => /\.(js|jsx|ts|tsx)$/i.test(filename);
exports.isCodeFile = isCodeFile;
