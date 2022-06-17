import Transport from 'winston-transport';
import { LogLevels, syslog } from '../logLevels';
interface AxiomTransportOptions extends Transport.TransportStreamOptions {
    axiom: {
        env: string;
        apiToken: string;
        service: string;
    };
    levels: LogLevels;
    levelMap: {
        [p in keyof typeof syslog.levels]: string;
    };
    staticMeta?: object;
}
export declare class AxiomTransport extends Transport {
    private static readonly OVERRIDEABLE_PAYLOAD;
    private readonly levelNumberMapping;
    private staticMeta?;
    private instance;
    private service;
    constructor(opts: AxiomTransportOptions);
    log(info: any, callback?: (err: Error | undefined) => void): any;
}
export {};
