"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLevelFontStyles = exports.create = void 0;
const winston_1 = __importDefault(require("winston"));
var createLogger_1 = require("./createLogger");
Object.defineProperty(exports, "create", { enumerable: true, get: function () { return createLogger_1.create; } });
/**
 * 新增訊息 level 的字體樣式 (若與舊有設定重複則覆蓋)
 *
 * @param levelFontStyles ex. { error: 'bold red yellowBG' }
 */
function addLevelFontStyles(levelFontStyles) {
    winston_1.default.addColors(levelFontStyles);
}
exports.addLevelFontStyles = addLevelFontStyles;
