import { LevelFontStyle } from '../utils';
export { create } from './createLogger';
export type { Logger } from './logger';
export type { LogOptions } from './options';
/**
 * 新增訊息 level 的字體樣式 (若與舊有設定重複則覆蓋)
 *
 * @param levelFontStyles ex. { error: 'bold red yellowBG' }
 */
export declare function addLevelFontStyles(levelFontStyles: {
    [key: string]: LevelFontStyle;
}): void;
