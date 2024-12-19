export type CodeTypeMapper = (ext: string) => string;

/**
 * Convert a list of mappings to a function to map file extension to code type.
 *
 * E.g. if you want files with a .tsx extension to have a ts code type for examples you could
 *
 * buildCodeTypeMap(['tsx:ts', 'jsx:js'])
 */
export const buildCodeTypeMap = (mappings: string[] = []): CodeTypeMapper => {
  const map = Object.fromEntries(mappings.map((value) => value.split(':')));

  return (ext: string) => map[ext] || ext;
};
