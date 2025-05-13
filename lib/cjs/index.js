"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestPracticeFileLines = exports.writeAction = exports.getFileBestPractices = exports.getBestPracticesDigest = exports.getAllBestPractices = exports.checkAction = exports.BestPractice = void 0;
const BestPractice_1 = __importDefault(require("./BestPractice"));
exports.BestPractice = BestPractice_1.default;
const check_1 = __importDefault(require("./actions/check"));
exports.checkAction = check_1.default;
const write_1 = __importStar(require("./actions/write"));
exports.writeAction = write_1.default;
Object.defineProperty(exports, "getBestPracticeFileLines", { enumerable: true, get: function () { return write_1.getBestPracticeFileLines; } });
const digest_1 = require("./utils/digest");
Object.defineProperty(exports, "getBestPracticesDigest", { enumerable: true, get: function () { return digest_1.getBestPracticesDigest; } });
const parse_1 = require("./utils/parse");
Object.defineProperty(exports, "getAllBestPractices", { enumerable: true, get: function () { return parse_1.getAllBestPractices; } });
Object.defineProperty(exports, "getFileBestPractices", { enumerable: true, get: function () { return parse_1.getFileBestPractices; } });
