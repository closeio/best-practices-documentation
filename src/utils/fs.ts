import { constants } from 'fs';
import { type FileHandle, access, readdir } from 'fs/promises';
import { join } from 'path';

/**
 * Asynchronously walks through a directory structure and yields filenames.
 * Uses a depth-first search pattern.
 */
export async function* walk(
  dir: string,
  context: string = '',
): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const next = await walk(join(dir, entry.name), join(context, entry.name));
      yield* next;
    } else {
      yield join(context, entry.name);
    }
  }
}

/**
 * Writes text to a file descriptor, adding a trailing newline.
 */
export const writeLine = (fd: FileHandle, line: string, newline = '\n') =>
  fd.write(`${line}${newline}`);

/**
 * Checks to see if a file exists or not.
 */
export const pathExists = async (filename: string) => {
  try {
    await access(filename, constants.F_OK);
  } catch {
    return false;
  }
  return true;
};

export const isCodeFile = (filename: string) =>
  /\.(js|jsx|ts|tsx)$/i.test(filename);
