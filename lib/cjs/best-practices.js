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
    commander_1.program;
    commander_1.program
        .command('check')
        .requiredOption('-s, --src-path <srcPath>')
        .requiredOption('-d, --dest-path <destPath>')
        .action((args) => {
        (0, check_1.default)(args);
    });
    commander_1.program
        .command('write')
        .requiredOption('-s, --src-path <srcPath>')
        .requiredOption('-d, --dest-path <destPath>')
        .requiredOption('-u, --code-url <codeUrl>')
        .action((args) => {
        (0, write_1.default)(Object.assign(Object.assign({}, args), { options: {} }));
    });
    commander_1.program.parse();
};
main();
