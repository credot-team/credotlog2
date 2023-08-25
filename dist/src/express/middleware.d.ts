/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import express from 'express';
import { Logger } from '../logger';
import { LogLevels } from '../logLevels';
type RequestLogLevels = 'info' | 'notice' | 'warn' | 'err';
type LevelMap<Levels> = {
    [p in RequestLogLevels]: keyof Levels;
};
type TraceGetter = (req: express.Request, res: express.Response) => string;
type Formatter<Response extends ServerResponse> = (info: MessageInfo, args: {
    res: Response;
    statusCode: number | undefined;
    jsonBody?: any;
}) => MessageInfo;
type Handler<Request extends IncomingMessage, Response extends ServerResponse> = (req: Request, res: Response, callback: (err?: Error) => void) => void;
interface MessageInfo {
    level: RequestLogLevels;
    message: string;
    traceInfo?: string;
    others?: any;
}
interface LogRequestOptions<Levels extends LogLevels, Response extends ServerResponse> {
    logger: Logger<Levels>;
    levelMap?: LevelMap<Levels>;
    formatter?: Formatter<Response>;
    logTraceInfo?: boolean;
    traceGetter?: TraceGetter;
}
/**
 * 建立 logger middleware
 * @param options
 */
export declare function logging<T extends LogLevels>(options: LogRequestOptions<T, express.Response>): Handler<express.Request, express.Response>;
export {};
