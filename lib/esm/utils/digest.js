"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestPracticesDigest = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
 * Generate a digest for the docs.
 *
 * Used to determine if the docs need to be updated or not.
 */
const getBestPracticesDigest = (bestPractices) => {
    const message = JSON.stringify(bestPractices.map((bp) => bp.toPOJO()));
    return crypto_js_1.default.SHA256(message).toString(crypto_js_1.default.enc.Hex);
};
exports.getBestPracticesDigest = getBestPracticesDigest;
