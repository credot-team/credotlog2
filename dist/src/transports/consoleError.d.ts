import Transport from 'winston-transport';
import winston from 'winston';
interface ConsoleErrorTransportOptions {
    errorLevel?: string;
}
export declare class ConsoleErrorTransport extends Transport {
    readonly format: winston.Logform.Format;
    private readonly errorLevel;
    constructor(opts: ConsoleErrorTransportOptions);
    log(info: any, callback?: (err: Error | undefined) => void): any;
}
export {};
