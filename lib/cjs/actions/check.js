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
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const digest_1 = require("../utils/digest");
const fs_1 = require("../utils/fs");
const parse_1 = require("../utils/parse");
const consts_1 = require("./consts");
/**
 * Compare the digest of the best practices against the stored digest to
 * see if the docs need to be updated.
 */
const checkAction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ srcPath: srcPaths, generatedPath }) {
    const allBestPractices = [];
    for (const srcPath of srcPaths) {
        const bestPractices = yield (0, parse_1.getAllBestPractices)(srcPath);
        allBestPractices.push(...bestPractices);
    }
    const currentDigest = (0, digest_1.getBestPracticesDigest)(allBestPractices);
    const previousDigest = yield getPreviousBestPracticesDigest(generatedPath);
    if (currentDigest === previousDigest) {
        return;
    }
    console.error(`Best practices documentation is not up to date. Please rebuild and commit the changes`);
    process.exit(1);
});
/**
 * Get the stored digest for best practices.
 */
const getPreviousBestPracticesDigest = (generatedPath) => __awaiter(void 0, void 0, void 0, function* () {
    const digestPath = path_1.default.join(generatedPath, consts_1.DIGEST_FILENAME);
    if (!(yield (0, fs_1.pathExists)(digestPath))) {
        return '';
    }
    const text = yield (0, promises_1.readFile)(digestPath, { encoding: 'utf8' });
    return text.trim();
});
exports.default = checkAction;
