"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceBestPractices = exports.insertBestPracticesIntoDoc = exports.replaceAllBestPracticesInDocs = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("./fs");
/**
 * Scan through a directory looking for places to insert best practices.
 */
const replaceAllBestPracticesInDocs = async (docsRoot, bestPractices, getBestPracticeLines) => {
    const index = new Map(bestPractices
        .filter((bp) => Boolean(bp.meta.id))
        .map((bp) => [bp.getMeta('id'), bp]));
    const insertedIds = [];
    if (index.size === 0) {
        return new Set(insertedIds);
    }
    for await (const filename of (0, fs_1.walk)(docsRoot)) {
        if ((0, fs_1.isDocFile)(filename)) {
            const inserted = await (0, exports.insertBestPracticesIntoDoc)(path_1.default.join(docsRoot, filename), index, getBestPracticeLines);
            insertedIds.push(...inserted);
        }
    }
    return new Set(insertedIds);
};
exports.replaceAllBestPracticesInDocs = replaceAllBestPracticesInDocs;
/**
 * Scan through a static documentation file and replace best practices lines
 */
const insertBestPracticesIntoDoc = async (filename, index, getBestPracticeLines) => {
    const oldLines = await (0, fs_1.readFileLines)(filename);
    const [newLines, insertedIds] = (0, exports.replaceBestPractices)(filename, oldLines, index, getBestPracticeLines);
    await (0, fs_1.writeFileLines)(filename, newLines);
    return new Set(insertedIds);
};
exports.insertBestPracticesIntoDoc = insertBestPracticesIntoDoc;
/**
 * Given lines from a file, return new lines with best practices inserted.
 */
const replaceBestPractices = (filename, lines, index, getBestPracticeLines) => {
    let inBestPractice = false;
    let lineNumber = 0;
    const newLines = [];
    const insertedIds = [];
    for (const line of lines) {
        lineNumber += 1;
        if (inBestPractice) {
            if (INSERT_END_RE.test(line)) {
                inBestPractice = false;
                // Do not continue, we want to write out the end line
            }
            else {
                continue;
            }
        }
        newLines.push(line);
        if (INSERT_START_RE.test(line)) {
            inBestPractice = true;
            const [, bestPracticeId] = INSERT_START_RE.exec(line);
            if (!index.has(bestPracticeId)) {
                throw new Error(`Missing best practice: file ${filename} at line ${lineNumber} expects best practice ID: ${bestPracticeId}. No best practice with this ID was found.`);
            }
            newLines.push(...getBestPracticeLines(index.get(bestPracticeId)));
            insertedIds.push(bestPracticeId);
        }
    }
    return [newLines, new Set(insertedIds)];
};
exports.replaceBestPractices = replaceBestPractices;
const INSERT_START_RE = /^\s*<!-- @BestPractice.insert (\S+) -->$/;
const INSERT_END_RE = /^\s*<!-- @BestPractice.end -->$/;
