import { LevelDefinition } from './index';
/**
 * The logging levels that npm use.
 *
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
export declare const npm: LevelDefinition<{
    error: number;
    warn: number;
    info: number;
    http: number;
    verbose: number;
    debug: number;
    silly: number;
}>;
