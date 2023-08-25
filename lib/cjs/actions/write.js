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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBestPractice = exports.SPECIAL_META_KEYS = exports.writeBestPractices = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const digest_1 = require("../utils/digest");
const fs_1 = require("../utils/fs");
const parse_1 = require("../utils/parse");
const string_1 = require("../utils/string");
const consts_1 = require("./consts");
/**
 * Generate best practices from source and write them out.
 */
function writeAction({ srcPath, destPath, codeUrl, options, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const bestPractices = yield (0, parse_1.getAllBestPractices)(srcPath);
        yield (0, exports.writeBestPractices)(destPath, bestPractices, codeUrl, options);
        yield writeBestPracticesDigest(destPath, (0, digest_1.getBestPracticesDigest)(bestPractices));
        return bestPractices;
    });
}
exports.default = writeAction;
/**
 * Writes best practices out to md doc files.
 */
const writeBestPractices = (contentDir, bestPractices, codeUrl, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.rm)(contentDir, { recursive: true });
    }
    catch (_a) {
        // Do nothing
    }
    yield (0, promises_1.mkdir)(contentDir);
    for (const bestPractice of bestPractices) {
        yield writeBestPracticeToFile(contentDir, bestPractice, codeUrl, options);
    }
});
exports.writeBestPractices = writeBestPractices;
exports.SPECIAL_META_KEYS = new Set(['title', 'subtitle', 'description']);
/**
 * Write a best practice to a markdown file.
 */
const writeBestPracticeToFile = (dir, bestPractice, codeUrl, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { filepath, filename } = bestPractice.getFileInfo();
    const dirpath = path_1.default.join(dir, ...filepath);
    const fullpath = path_1.default.join(dirpath, filename);
    const dirExists = yield (0, fs_1.pathExists)(dirpath);
    const fileExists = yield (0, fs_1.pathExists)(fullpath);
    const writeTitle = !fileExists;
    let fd;
    try {
        if (!dirExists) {
            yield (0, promises_1.mkdir)(dirpath, { recursive: true });
        }
        fd = yield (0, promises_1.open)(fullpath, 'a');
        for (const line of writeBestPractice(bestPractice, codeUrl, Object.assign({ writeTitle }, options))) {
            yield (0, fs_1.writeLine)(fd, line);
        }
    }
    finally {
        fd === null || fd === void 0 ? void 0 : fd.close();
    }
});
/**
 * Generate best practice lines.
 */
function* writeBestPractice(bestPractice, codeUrl, { writeTitle = true, writeExtraMeta = true }) {
    if (writeTitle) {
        yield '---';
        yield `title: ${bestPractice.getTitle()}`;
        yield '---';
    }
    if (writeExtraMeta) {
        for (const [key, lines] of Object.entries(bestPractice.meta)) {
            if (exports.SPECIAL_META_KEYS.has(key)) {
                continue;
            }
            yield `## ${key}`;
            for (const line of lines) {
                yield line;
            }
        }
    }
    // If given, write the subtitle as a single line
    if (bestPractice.getSubtitle()) {
        yield `### ${bestPractice.getSubtitle()}`;
    }
    // If given, write out the description lines
    const description = bestPractice.meta.description;
    if (description) {
        for (const line of (0, string_1.unindent)(description)) {
            yield line;
        }
        yield '';
    }
    const { sourceFilename, startLine, endLine } = bestPractice;
    const url = `${codeUrl}/${sourceFilename}#L${startLine}-L${endLine}`;
    yield `[${sourceFilename} lines ${startLine}-${endLine}](${url})`;
    yield `\`\`\`${bestPractice.getFileType()}`;
    for (const line of (0, string_1.unindent)(bestPractice.codeLines)) {
        yield line;
    }
    yield '```';
}
exports.writeBestPractice = writeBestPractice;
/**
 * Write the digest for best practices.
 */
const writeBestPracticesDigest = (destPath, digest) => __awaiter(void 0, void 0, void 0, function* () {
    const digestPath = path_1.default.join(destPath, consts_1.DIGEST_FILENAME);
    let fd;
    try {
        fd = yield (0, promises_1.open)(digestPath, 'w');
        yield (0, fs_1.writeLine)(fd, digest);
    }
    finally {
        yield (fd === null || fd === void 0 ? void 0 : fd.close());
    }
});
