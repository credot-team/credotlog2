import Transport from 'winston-transport';
import { LogLevels, syslog } from '../logLevels';
interface GraylogTransportOptions extends Transport.TransportStreamOptions {
    graylog: {
        server: {
            host: string;
            port?: number;
        };
        hostname: string;
    };
    levels: LogLevels;
    levelMap: {
        [p in keyof typeof syslog.levels]: string;
    };
    staticMeta?: object;
}
export declare class GraylogTransport extends Transport {
    private static readonly VERSION;
    private static readonly API_PATH;
    private static readonly OVERRIDEABLE_PAYLOAD;
    private readonly hostname;
    private readonly levelNumberMapping;
    private gelfUrl;
    private staticMeta?;
    constructor(opts: GraylogTransportOptions);
    log(info: any, callback?: (err: Error | undefined) => void): any;
}
export {};
