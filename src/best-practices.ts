#!/usr/bin/env node
import { program } from 'commander';
import checkAction from './actions/check';
import writeAction from './actions/write';

const main = () => {
  program
    .command('check')
    .requiredOption('-s, --src-path <srcPath>')
    .requiredOption('-g, --generated-path <generatedPath>')
    .action((args) => {
      checkAction(args);
    });

  program
    .command('write')
    .requiredOption('-s, --src-path <srcPath>')
    .option('-d, --docs-path <docsPath>')
    .requiredOption('-g, --generated-path <generatedPath>')
    .requiredOption('-u, --code-url <codeUrl>')
    .option(
      '-m, --extension-mappings <mappings...>',
      'e.g. jsx:js to map jsx to js',
    )
    .action((args) => {
      writeAction({ ...args, options: {} });
    });

  program.parse();
};

main();
