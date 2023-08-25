/**
 * Removes indentation from code lines.
 */
export const unindent = (lines: string[]) => {
  let indent = -1;

  for (const line of lines) {
    const [, leadingSpace] = /^(\s*)/.exec(line)!;
    if (indent === -1) {
      indent = leadingSpace.length;
    } else {
      indent = Math.min(indent, leadingSpace.length);
    }
  }

  return indent === 0 ? lines : lines.map((line) => line.slice(indent));
};
