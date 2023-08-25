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
exports.getFileBestPractices = exports.getAllBestPractices = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const BestPractice_1 = __importDefault(require("../BestPractice"));
const fs_1 = require("./fs");
/**
 * Recursively walk the srcDir and pull best practices from all code files.
 */
const getAllBestPractices = (srcDir) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const bestPractices = [];
    try {
        for (var _d = true, _e = __asyncValues((0, fs_1.walk)(srcDir)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const filename = _c;
            if ((0, fs_1.isCodeFile)(filename)) {
                const fileBestPractices = yield (0, exports.getFileBestPractices)(srcDir, filename);
                if (fileBestPractices.length !== 0) {
                    bestPractices.push(...fileBestPractices);
                }
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
    bestPractices.sort((left, right) => left.compare(right));
    return bestPractices;
});
exports.getAllBestPractices = getAllBestPractices;
/**
 * Scan through the file at root/filename searching for best practices.
 */
const getFileBestPractices = (root, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const text = yield (0, promises_1.readFile)(path_1.default.join(root, filename), { encoding: 'utf8' });
    const lines = text.split('\n');
    const bestPractices = [new BestPractice_1.default(filename)];
    lines.forEach((line, index) => {
        const latest = bestPractices[bestPractices.length - 1];
        latest.parseLine(index, line);
        if (latest.getState() === 'DONE') {
            bestPractices.push(new BestPractice_1.default(filename));
        }
    });
    return bestPractices.filter((bp) => bp.getState() !== 'NOT_STARTED');
});
exports.getFileBestPractices = getFileBestPractices;
