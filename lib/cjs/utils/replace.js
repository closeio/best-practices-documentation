"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
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
const replaceAllBestPracticesInDocs = (docsRoot, bestPractices, getBestPracticeLines) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const index = new Map(bestPractices
        .filter((bp) => Boolean(bp.meta.id))
        .map((bp) => [bp.getMeta('id'), bp]));
    const insertedIds = [];
    if (index.size === 0) {
        return new Set(insertedIds);
    }
    try {
        for (var _d = true, _e = __asyncValues((0, fs_1.walk)(docsRoot)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const filename = _c;
            if ((0, fs_1.isDocFile)(filename)) {
                const inserted = yield (0, exports.insertBestPracticesIntoDoc)(path_1.default.join(docsRoot, filename), index, getBestPracticeLines);
                insertedIds.push(...inserted);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return new Set(insertedIds);
});
exports.replaceAllBestPracticesInDocs = replaceAllBestPracticesInDocs;
/**
 * Scan through a static documentation file and replace best practices lines
 */
const insertBestPracticesIntoDoc = (filename, index, getBestPracticeLines) => __awaiter(void 0, void 0, void 0, function* () {
    const oldLines = yield (0, fs_1.readFileLines)(filename);
    const [newLines, insertedIds] = (0, exports.replaceBestPractices)(filename, oldLines, index, getBestPracticeLines);
    yield (0, fs_1.writeFileLines)(filename, newLines);
    return new Set(insertedIds);
});
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
