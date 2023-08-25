#!/usr/bin/env node
import { program } from 'commander';
import checkAction from './actions/check';
import writeAction from './actions/write';

const main = () => {
  program;

  program
    .command('check')
    .requiredOption('-s, --src-path <srcPath>')
    .requiredOption('-d, --dest-path <destPath>')
    .action((args) => {
      checkAction(args);
    });

  program
    .command('write')
    .requiredOption('-s, --src-path <srcPath>')
    .requiredOption('-d, --dest-path <destPath>')
    .requiredOption('-u, --code-url <codeUrl>')
    .action((args) => {
      writeAction({ ...args, options: {} });
    });

  program.parse();
};

main();
