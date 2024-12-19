import { mkdir, open, rm } from 'fs/promises';
import path from 'path';
import BestPractice from '../BestPractice';
import { type CodeTypeMapper, buildCodeTypeMap } from '../utils/codeType';
import { getBestPracticesDigest } from '../utils/digest';
import { pathExists, writeLine } from '../utils/fs';
import { getAllBestPractices } from '../utils/parse';
import { replaceAllBestPracticesInDocs } from '../utils/replace';
import { unindent } from '../utils/string';
import { DIGEST_FILENAME } from './consts';

type WriteOptions = {
  writeExtraMeta?: boolean;
};

type WriteArgs = {
  srcPath: string;
  docsPath?: string;
  generatedPath: string;
  codeUrl: string;
  extensionMappings?: string[];
  options: WriteOptions;
};

/**
 * Generate best practices from source and write them out.
 */
export default async function writeAction({
  srcPath,
  docsPath,
  generatedPath,
  codeUrl,
  extensionMappings,
  options,
}: WriteArgs) {
  const codeTypeMap = buildCodeTypeMap(extensionMappings ?? []);

  const allBestPractices = await getAllBestPractices(srcPath);
  let filteredBestPractices: BestPractice[];

  if (docsPath) {
    // It's OK if the generatedPath is within docsPath, because we'll completely replace
    // the generated path next. This is a feature not a bug.
    const usedIds = await replaceAllBestPracticesInDocs(
      docsPath,
      allBestPractices,
      (bestPractice) =>
        getBestPracticeCodeLines(bestPractice, codeUrl, codeTypeMap),
    );
    // If a best practice was written out to a static file, do not also include it in the
    // generated output
    filteredBestPractices = allBestPractices.filter(
      (bp) => !usedIds.has(bp.getMeta('id')),
    );
  } else {
    filteredBestPractices = allBestPractices;
  }

  await writeBestPractices(
    generatedPath,
    filteredBestPractices,
    codeUrl,
    codeTypeMap,
    options,
  );
  await writeBestPracticesDigest(
    generatedPath,
    getBestPracticesDigest(allBestPractices),
  );

  return filteredBestPractices;
}

/**
 * Writes best practices out to Markdown doc files.
 */
export const writeBestPractices = async (
  contentDir: string,
  bestPractices: BestPractice[],
  codeUrl: string,
  codeTypeMap: CodeTypeMapper,
  options: WriteOptions,
) => {
  try {
    await rm(contentDir, { recursive: true });
  } catch {
    // Do nothing
  }

  await mkdir(contentDir);

  for (const bestPractice of bestPractices) {
    await writeBestPracticeToFile(
      contentDir,
      bestPractice,
      codeUrl,
      codeTypeMap,
      options,
    );
  }
};

export const SPECIAL_META_KEYS = new Set(['title', 'subtitle', 'description']);

/**
 * Write a best practice to a markdown file.
 */
const writeBestPracticeToFile = async (
  dir: string,
  bestPractice: BestPractice,
  codeUrl: string,
  codeTypeMap: CodeTypeMapper,
  options: WriteOptions,
) => {
  const { filepath, filename } = bestPractice.getFileInfo();
  const dirpath = path.join(dir, ...filepath);
  const fullpath = path.join(dirpath, filename);

  const dirExists = await pathExists(dirpath);
  const fileExists = await pathExists(fullpath);
  const writeTitle = !fileExists;

  let fd;

  try {
    if (!dirExists) {
      await mkdir(dirpath, { recursive: true });
    }

    fd = await open(fullpath, 'a');
    for (const line of getBestPracticeFileLines(
      bestPractice,
      codeUrl,
      codeTypeMap,
      {
        writeTitle,
        ...options,
      },
    )) {
      await writeLine(fd, line);
    }
  } finally {
    fd?.close();
  }
};

type WriteBestPracticeOptions = {
  writeTitle?: boolean;
  writeExtraMeta?: boolean;
};

/**
 * Generate best practice lines.
 */
export function* getBestPracticeFileLines(
  bestPractice: BestPractice,
  codeUrl: string,
  codeTypeMap: CodeTypeMapper,
  { writeTitle = true, writeExtraMeta = false }: WriteBestPracticeOptions,
): Generator<string> {
  if (writeTitle) {
    yield '---';
    yield `title: ${bestPractice.getTitle()}`;
    yield '---';
  }

  if (writeExtraMeta) {
    for (const [key, lines] of Object.entries(bestPractice.meta)) {
      if (SPECIAL_META_KEYS.has(key)) {
        continue;
      }

      yield `## ${key}`;

      for (const line of lines) {
        yield line;
      }
    }
  }

  // If given, write the subtitle as a single line
  if (bestPractice.getSubtitle()) {
    yield `### ${bestPractice.getSubtitle()}`;
  }

  // If given, write out the description lines
  const description = bestPractice.meta.description;
  if (description) {
    for (const line of unindent(description)) {
      yield line;
    }
    yield '';
  }

  for (const line of getBestPracticeCodeLines(
    bestPractice,
    codeUrl,
    codeTypeMap,
  )) {
    yield line;
  }
}

const getBestPracticeCodeLines = (
  bestPractice: BestPractice,
  codeUrl: string,
  codeTypeMap: CodeTypeMapper,
): string[] => {
  const { sourceFilename, startLine, endLine } = bestPractice;
  const url = `${codeUrl}/${sourceFilename}#L${startLine}-L${endLine}`;
  const codeType = codeTypeMap(bestPractice.getFileType());
  return [
    `\`\`\`${codeType}`,
    ...unindent(bestPractice.codeLines),
    '```',
    `From [${sourceFilename} lines ${startLine}-${endLine}](${url})`,
  ];
};

/**
 * Write the digest for best practices.
 */
const writeBestPracticesDigest = async (
  generatedPath: string,
  digest: string,
) => {
  const digestPath = path.join(generatedPath, DIGEST_FILENAME);
  let fd;

  try {
    fd = await open(digestPath, 'w');
    await writeLine(fd, digest);
  } finally {
    await fd?.close();
  }
};
