export type LogLevels = {
    [key: string]: number;
};
export type LevelDefinition<T> = {
    levels: T;
    colors: any;
};
export type DefaultLogLevels = typeof Default.levels;
export declare const Default: LevelDefinition<{
    emerg: number;
    alert: number;
    crit: number;
    err: number;
    warning: number;
    notice: number;
    info: number;
    debug: number;
}>;
export declare const syslog: LevelDefinition<{
    emerg: number;
    alert: number;
    crit: number;
    err: number;
    warning: number;
    notice: number;
    info: number;
    debug: number;
}>;
/**
 * Alias for syslog
 * @see syslog
 */
export declare const rfc5424: LevelDefinition<{
    emerg: number;
    alert: number;
    crit: number;
    err: number;
    warning: number;
    notice: number;
    info: number;
    debug: number;
}>;
export declare const npm: LevelDefinition<{
    error: number;
    warn: number;
    info: number;
    http: number;
    verbose: number;
    debug: number;
    silly: number;
}>;
