export declare const init: (protocol: string, urlHost: string, serviceName: string) => void;
/**
 * sfslfms;dfmskdfm;sdmf
 * @param {string} level hshdhdoshdlodklds
 * @param {string} message fdsfldsl
 * @param {object} others
 * @param {property} others.host
 * @returns {Promise<void>}
 */
export declare const log: (level: 'Emerg' | 'Alert' | 'Crit' | 'Err' | 'Warning' | 'Notice' | 'Info' | 'Debug', message: string, others?: object | undefined) => Promise<void>;
declare type colors = 'black' | 'info' | 'success' | 'warning' | 'error' | 'debug';
export declare const colorlog: (message: string, color?: colors) => void;
export declare const levellog: (message: string, level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
export {};
