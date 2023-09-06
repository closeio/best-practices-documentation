"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileBestPractices = exports.getAllBestPractices = void 0;
const path_1 = __importDefault(require("path"));
const BestPractice_1 = __importDefault(require("../BestPractice"));
const fs_1 = require("./fs");
/**
 * Recursively walk the srcDir and pull best practices from all code files.
 */
const getAllBestPractices = async (srcDir) => {
    const bestPractices = [];
    for await (const filename of (0, fs_1.walk)(srcDir)) {
        if ((0, fs_1.isCodeFile)(filename)) {
            const fileBestPractices = await (0, exports.getFileBestPractices)(srcDir, filename);
            if (fileBestPractices.length !== 0) {
                bestPractices.push(...fileBestPractices);
            }
        }
    }
    bestPractices.sort((left, right) => left.compare(right));
    return bestPractices;
};
exports.getAllBestPractices = getAllBestPractices;
/**
 * Scan through the file at root/filename searching for best practices.
 */
const getFileBestPractices = async (root, filename) => {
    const lines = await (0, fs_1.readFileLines)(path_1.default.join(root, filename));
    const bestPractices = [new BestPractice_1.default(filename)];
    lines.forEach((line, index) => {
        const latest = bestPractices[bestPractices.length - 1];
        latest.parseLine(index + 1, line);
        if (latest.getState() === 'DONE') {
            bestPractices.push(new BestPractice_1.default(filename));
        }
    });
    return bestPractices.filter((bp) => bp.getState() !== 'NOT_STARTED');
};
exports.getFileBestPractices = getFileBestPractices;
