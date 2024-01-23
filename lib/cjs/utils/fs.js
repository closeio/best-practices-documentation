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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocFile = exports.isCodeFile = exports.writeFileLines = exports.readFileLines = exports.pathExists = exports.writeLine = exports.walk = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const promises_2 = require("fs/promises");
const path_1 = require("path");
/**
 * Asynchronously walks through a directory structure and yields filenames.
 * Uses a depth-first search pattern.
 */
function walk(dir, context = '') {
    return __asyncGenerator(this, arguments, function* walk_1() {
        const entries = yield __await((0, promises_2.readdir)(dir, { withFileTypes: true }));
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const next = yield __await(walk((0, path_1.join)(dir, entry.name), (0, path_1.join)(context, entry.name)));
                yield __await(yield* __asyncDelegator(__asyncValues(next)));
            }
            else {
                yield yield __await((0, path_1.join)(context, entry.name));
            }
        }
    });
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
const pathExists = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_2.access)(filename, fs_1.constants.F_OK);
    }
    catch (_a) {
        return false;
    }
    return true;
});
exports.pathExists = pathExists;
const readFileLines = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const text = yield (0, promises_1.readFile)(filename, { encoding: 'utf8' });
    return text.split('\n');
});
exports.readFileLines = readFileLines;
const writeFileLines = (filename, lines) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, promises_1.writeFile)(filename, lines.map((line) => `${line}\n`));
});
exports.writeFileLines = writeFileLines;
const isCodeFile = (filename) => /\.(js|jsx|ts|tsx)$/i.test(filename);
exports.isCodeFile = isCodeFile;
const isDocFile = (filename) => /\.mdx?$/i.test(filename);
exports.isDocFile = isDocFile;
