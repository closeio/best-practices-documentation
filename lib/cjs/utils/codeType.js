"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCodeTypeMap = void 0;
/**
 * Convert a list of mappings to a function to map file extension to code type.
 *
 * E.g. if you want files with a .tsx extension to have a ts code type for examples you could
 *
 * buildCodeTypeMap(['tsx:ts', 'jsx:js'])
 */
const buildCodeTypeMap = (mappings = []) => {
    const map = Object.fromEntries(mappings.map((value) => value.split(':')));
    return (ext) => map[ext] || ext;
};
exports.buildCodeTypeMap = buildCodeTypeMap;
