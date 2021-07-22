/**
 * @param {string} protocol http/https
 * @param {string} urlHost 網址
 * @param {string} serviceName graylog的source
 */
export declare const init: (protocol: 'http' | 'https', urlHost: string, serviceName: string) => void;
/**
 * @param {string} level 等級
 * @param {string} message
 * @param {object} others 其他設定
 * @returns {Promise<void>}
 */
export declare const log: (level: 'Emerg' | 'Alert' | 'Crit' | 'Err' | 'Warning' | 'Notice' | 'Info' | 'Debug', message: string, others?: object | undefined) => Promise<void>;
declare type colors = 'black' | 'info' | 'success' | 'warning' | 'error' | 'debug';
/**
 * 指定輸出顏色
 * @param {string} color 顏色 'black' | 'info' | 'success' | 'warning' | 'error' | 'debug'
 * @param {string} message
 */
export declare const colorlog: (message: string, color?: colors) => void;
/**
 * 指定log等級
 * @param {number} level 等級 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
 * @param {string} message
 */
export declare const levellog: (message: string, level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
export {};
