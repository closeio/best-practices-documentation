export type CodeTypeMapper = (ext: string) => string;
/**
 * Convert a list of mappings to a function to map file extension to code type.
 *
 * E.g. if you want files with a .tsx extension to have a ts code type for examples you could
 *
 * buildCodeTypeMap(['tsx:ts', 'jsx:js'])
 */
export declare const buildCodeTypeMap: (mappings?: string[]) => CodeTypeMapper;
//# sourceMappingURL=codeType.d.ts.map