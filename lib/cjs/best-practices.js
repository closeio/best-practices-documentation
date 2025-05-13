#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const check_1 = __importDefault(require("./actions/check"));
const write_1 = __importDefault(require("./actions/write"));
const main = () => {
    commander_1.program
        .command('check')
        .requiredOption('-s, --src-path <srcPath...>')
        .requiredOption('-g, --generated-path <generatedPath>')
        .action((args) => {
        (0, check_1.default)(args);
    });
    commander_1.program
        .command('write')
        .requiredOption('-s, --src-path <srcPath...>')
        .option('-d, --docs-path <docsPath>')
        .requiredOption('-g, --generated-path <generatedPath>')
        .requiredOption('-u, --code-url <codeUrl>')
        .option('-m, --extension-mappings <mappings...>', 'e.g. jsx:js to map jsx to js')
        .action((args) => {
        (0, write_1.default)(Object.assign(Object.assign({}, args), { options: {} }));
    });
    commander_1.program.parse();
};
main();
