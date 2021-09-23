export declare type LogLevels = {
    [key: string]: number;
};
export declare type LevelDefinition<T> = {
    levels: T;
    colors: any;
};
export declare type DefaultLogLevels = typeof Default.levels;
export declare const Default: LevelDefinition<{
    notice: number;
    emerg: number;
    alert: number;
    warning: number;
    err: number;
    debug: number;
    crit: number;
    info: number;
}>;
export declare const syslog: LevelDefinition<{
    notice: number;
    emerg: number;
    alert: number;
    warning: number;
    err: number;
    debug: number;
    crit: number;
    info: number;
}>;
/**
 * Alias for syslog
 * @see syslog
 */
export declare const rfc5424: LevelDefinition<{
    notice: number;
    emerg: number;
    alert: number;
    warning: number;
    err: number;
    debug: number;
    crit: number;
    info: number;
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
