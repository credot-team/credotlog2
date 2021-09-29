import { IncomingMessage, ServerResponse } from 'http';
import express from 'express';
import onFinished from 'on-finished';
import onHeaders from 'on-headers';
import parseurl from 'parseurl';
import { Logger } from '../logger';
import { DefaultLogLevels, LogLevels } from '../logLevels';
import jsonStringify from 'safe-stable-stringify';

type RequestLogLevels = 'info' | 'notice' | 'warn' | 'err';

type LevelMap<Levels> = {
  [p in RequestLogLevels]: keyof Levels;
};

type Formatter<Response extends ServerResponse> = (
  info: MessageInfo,
  args: {
    res: Response;
    statusCode: number | undefined;
    jsonBody?: any;
  },
) => MessageInfo;

type Handler<Request extends IncomingMessage, Response extends ServerResponse> = (
  req: Request,
  res: Response,
  callback: (err?: Error) => void,
) => void;

type WithStartTimeRecorded = {
  _startAt?: ReturnType<typeof process.hrtime>;
};

interface MessageInfo {
  level: RequestLogLevels;
  message: string;
  others?: any;
}

interface LogRequestOptions<Levels extends LogLevels, Response extends ServerResponse> {
  logger: Logger<Levels>;
  levelMap?: LevelMap<Levels>;
  formatter?: Formatter<Response>;
}

//============================================================
// Type defined end
//============================================================

const UNDEFINED_CHAR = '-';

const defaultLevelMap: LevelMap<DefaultLogLevels> = {
  info: 'info',
  notice: 'notice',
  err: 'err',
  warn: 'warning',
};

const JSON_DATA_SYMBOL = Symbol.for('json-data');
function recordJsonOutput(res: express.Response) {
  const prevJson = res.json;
  res.json = function (...args) {
    // @ts-ignore
    res[JSON_DATA_SYMBOL] = args[0];
    return prevJson.apply(res, args);
  };
}

function recordStartTime(this: any) {
  (this as WithStartTimeRecorded)._startAt = process.hrtime();
}

/**
 * 建立 logger middleware
 * @param options
 */
export function logging<T extends LogLevels>(
  options: LogRequestOptions<T, express.Response>,
): Handler<express.Request, express.Response> {
  const rSymbol = Symbol.for('credotlog');

  return (req, res, next) => {
    // 防止重複註冊事件
    // @ts-ignore
    if (!req[rSymbol]) {
      recordStartTime.call(req);
      recordJsonOutput(res);
      // @ts-ignore
      req[rSymbol] = true;
      onHeaders(res, recordStartTime);
    }
    onFinished(res, log(options));
    next();
  };
}

function log(options: LogRequestOptions<any, any>) {
  const opts: Required<LogRequestOptions<any, any>> = {
    logger: options.logger,
    levelMap: options.levelMap ?? defaultLevelMap,
    formatter: options.formatter ?? defaultFormatter,
  };

  return (err: Error | null, res: ServerResponse & WithStartTimeRecorded) => {
    logRequest(err, res, opts);
  };
}

function logRequest(
  err: Error | null,
  res: ServerResponse & WithStartTimeRecorded,
  opts: Required<LogRequestOptions<any, any>>,
) {
  const req = res.req as IncomingMessage & WithStartTimeRecorded;

  const status = res.headersSent ? res.statusCode : undefined;

  const costTime =
    req._startAt && res._startAt
      ? (
          (res._startAt[0] - req._startAt[0]) * 1e3 +
          (res._startAt[1] - req._startAt[1]) * 1e-6
        ).toFixed(3)
      : UNDEFINED_CHAR;

  // get content-length
  const contentLength = res.getHeader('content-length') || UNDEFINED_CHAR;
  // get request url path
  const path = parseurl.original(req)?.path ?? UNDEFINED_CHAR;
  // generate message string
  const message = `HTTP ${req.method} ${path} ${status} ${costTime} ${contentLength}`;

  // choose level by status
  const level: RequestLogLevels = !status
    ? 'err'
    : status >= 500
    ? 'err'
    : status >= 400
    ? 'warn'
    : 'info';

  // @ts-ignore try to get json-response
  const jsonBody = res[JSON_DATA_SYMBOL];

  let info: MessageInfo = { level: level, message: message };
  try {
    if (opts.formatter) {
      info = opts.formatter(info, { res, statusCode: status, jsonBody: jsonBody });
    }
  } finally {
    opts.logger.log(opts.levelMap[info.level], info.message, info.others);
  }
}

/**
 * 預設 formatter。
 * 在訊息後添加 errorCode 與 errorMessage，並且在 errorCode > 0 時將 level 改為 'notice'
 * @param info
 * @param args
 */
const defaultFormatter: Formatter<express.Response> = (info, args) => {
  if (!(args.statusCode === 200 && args.jsonBody)) return info;

  const { errorCode, errorMessage } = args.jsonBody;
  info.message = `${info.message} ${jsonStringify({ errorCode, errorMessage })}`;
  if (errorCode > 0) info.level = 'notice';
  return info;
};
