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
exports.SPECIAL_META_KEYS = exports.writeBestPractices = void 0;
exports.default = writeAction;
exports.getBestPracticeFileLines = getBestPracticeFileLines;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const codeType_1 = require("../utils/codeType");
const digest_1 = require("../utils/digest");
const fs_1 = require("../utils/fs");
const parse_1 = require("../utils/parse");
const replace_1 = require("../utils/replace");
const string_1 = require("../utils/string");
const consts_1 = require("./consts");
/**
 * Generate best practices from source and write them out.
 */
function writeAction(_a) {
    return __awaiter(this, arguments, void 0, function* ({ srcPath, docsPath, generatedPath, codeUrl, extensionMappings, options, }) {
        const codeTypeMap = (0, codeType_1.buildCodeTypeMap)(extensionMappings !== null && extensionMappings !== void 0 ? extensionMappings : []);
        const allBestPractices = yield (0, parse_1.getAllBestPractices)(srcPath);
        let filteredBestPractices;
        if (docsPath) {
            // It's OK if the generatedPath is within docsPath, because we'll completely replace
            // the generated path next. This is a feature not a bug.
            const usedIds = yield (0, replace_1.replaceAllBestPracticesInDocs)(docsPath, allBestPractices, (bestPractice) => getBestPracticeCodeLines(bestPractice, codeUrl, codeTypeMap));
            // If a best practice was written out to a static file, do not also include it in the
            // generated output
            filteredBestPractices = allBestPractices.filter((bp) => !usedIds.has(bp.getMeta('id')));
        }
        else {
            filteredBestPractices = allBestPractices;
        }
        yield (0, exports.writeBestPractices)(generatedPath, filteredBestPractices, codeUrl, codeTypeMap, options);
        yield writeBestPracticesDigest(generatedPath, (0, digest_1.getBestPracticesDigest)(allBestPractices));
        return filteredBestPractices;
    });
}
/**
 * Writes best practices out to Markdown doc files.
 */
const writeBestPractices = (contentDir, bestPractices, codeUrl, codeTypeMap, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.rm)(contentDir, { recursive: true });
    }
    catch (_a) {
        // Do nothing
    }
    yield (0, promises_1.mkdir)(contentDir);
    for (const bestPractice of bestPractices) {
        yield writeBestPracticeToFile(contentDir, bestPractice, codeUrl, codeTypeMap, options);
    }
});
exports.writeBestPractices = writeBestPractices;
exports.SPECIAL_META_KEYS = new Set(['title', 'subtitle', 'description']);
/**
 * Write a best practice to a markdown file.
 */
const writeBestPracticeToFile = (dir, bestPractice, codeUrl, codeTypeMap, options) => __awaiter(void 0, void 0, void 0, function* () {
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
        for (const line of getBestPracticeFileLines(bestPractice, codeUrl, codeTypeMap, Object.assign({ writeTitle }, options))) {
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
function* getBestPracticeFileLines(bestPractice, codeUrl, codeTypeMap, { writeTitle = true, writeExtraMeta = false }) {
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
    for (const line of getBestPracticeCodeLines(bestPractice, codeUrl, codeTypeMap)) {
        yield line;
    }
}
const getBestPracticeCodeLines = (bestPractice, codeUrl, codeTypeMap) => {
    const { sourceFilename, startLine, endLine } = bestPractice;
    const url = `${codeUrl}/${sourceFilename}#L${startLine}-L${endLine}`;
    const codeType = codeTypeMap(bestPractice.getFileType());
    return [
        `\`\`\`${codeType}`,
        ...(0, string_1.unindent)(bestPractice.codeLines),
        '```',
        `From [${sourceFilename} lines ${startLine}-${endLine}](${url})`,
    ];
};
/**
 * Write the digest for best practices.
 */
const writeBestPracticesDigest = (generatedPath, digest) => __awaiter(void 0, void 0, void 0, function* () {
    const digestPath = path_1.default.join(generatedPath, consts_1.DIGEST_FILENAME);
    let fd;
    try {
        fd = yield (0, promises_1.open)(digestPath, 'w');
        yield (0, fs_1.writeLine)(fd, digest);
    }
    finally {
        yield (fd === null || fd === void 0 ? void 0 : fd.close());
    }
});
