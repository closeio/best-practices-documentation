"use strict";
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
const checkAction = async ({ srcPath, generatedPath }) => {
    const bestPractices = await (0, parse_1.getAllBestPractices)(srcPath);
    const currentDigest = (0, digest_1.getBestPracticesDigest)(bestPractices);
    const previousDigest = await getPreviousBestPracticesDigest(generatedPath);
    if (currentDigest === previousDigest) {
        return;
    }
    console.error(`Best practices documentation is not up to date. Please rebuild and commit the changes`);
    process.exit(1);
};
/**
 * Get the stored digest for best practices.
 */
const getPreviousBestPracticesDigest = async (generatedPath) => {
    const digestPath = path_1.default.join(generatedPath, consts_1.DIGEST_FILENAME);
    if (!(await (0, fs_1.pathExists)(digestPath))) {
        return '';
    }
    const text = await (0, promises_1.readFile)(digestPath, { encoding: 'utf8' });
    return text.trim();
};
exports.default = checkAction;
