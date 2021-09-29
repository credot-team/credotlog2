"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logging = void 0;
const on_finished_1 = __importDefault(require("on-finished"));
const on_headers_1 = __importDefault(require("on-headers"));
const parseurl_1 = __importDefault(require("parseurl"));
const safe_stable_stringify_1 = __importDefault(require("safe-stable-stringify"));
//============================================================
// Type defined end
//============================================================
const UNDEFINED_CHAR = '-';
const defaultLevelMap = {
    info: 'info',
    notice: 'notice',
    err: 'err',
    warn: 'warning',
};
const JSON_DATA_SYMBOL = Symbol.for('json-data');
function recordJsonOutput(res) {
    const prevJson = res.json;
    res.json = function (...args) {
        // @ts-ignore
        res[JSON_DATA_SYMBOL] = args[0];
        return prevJson.apply(res, args);
    };
}
function recordStartTime() {
    this._startAt = process.hrtime();
}
/**
 * 建立 logger middleware
 * @param options
 */
function logging(options) {
    const rSymbol = Symbol.for('credotlog');
    return (req, res, next) => {
        // 防止重複註冊事件
        // @ts-ignore
        if (!req[rSymbol]) {
            recordStartTime.call(req);
            recordJsonOutput(res);
            // @ts-ignore
            req[rSymbol] = true;
            (0, on_headers_1.default)(res, recordStartTime);
        }
        (0, on_finished_1.default)(res, log(options));
        next();
    };
}
exports.logging = logging;
function log(options) {
    var _a, _b;
    const opts = {
        logger: options.logger,
        levelMap: (_a = options.levelMap) !== null && _a !== void 0 ? _a : defaultLevelMap,
        formatter: (_b = options.formatter) !== null && _b !== void 0 ? _b : defaultFormatter,
    };
    return (err, res) => {
        logRequest(err, res, opts);
    };
}
function logRequest(err, res, opts) {
    var _a, _b;
    const req = res.req;
    const status = res.headersSent ? res.statusCode : undefined;
    const costTime = req._startAt && res._startAt
        ? ((res._startAt[0] - req._startAt[0]) * 1e3 +
            (res._startAt[1] - req._startAt[1]) * 1e-6).toFixed(3)
        : UNDEFINED_CHAR;
    // get content-length
    const contentLength = res.getHeader('content-length') || UNDEFINED_CHAR;
    // get request url path
    const path = (_b = (_a = parseurl_1.default.original(req)) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : UNDEFINED_CHAR;
    // generate message string
    const message = `HTTP ${req.method} ${path} ${status} ${costTime} ${contentLength}`;
    // choose level by status
    const level = !status
        ? 'err'
        : status >= 500
            ? 'err'
            : status >= 400
                ? 'warn'
                : 'info';
    // @ts-ignore try to get json-response
    const jsonBody = res[JSON_DATA_SYMBOL];
    let info = { level: level, message: message };
    try {
        if (opts.formatter) {
            info = opts.formatter(info, { res, statusCode: status, jsonBody: jsonBody });
        }
    }
    finally {
        opts.logger.log(opts.levelMap[info.level], info.message, info.others);
    }
}
/**
 * 預設 formatter。
 * 在訊息後添加 errorCode 與 errorMessage，並且在 errorCode > 0 時將 level 改為 'notice'
 * @param info
 * @param args
 */
const defaultFormatter = (info, args) => {
    if (!(args.statusCode === 200 && args.jsonBody))
        return info;
    const { errorCode, errorMessage } = args.jsonBody;
    info.message = `${info.message} ${(0, safe_stable_stringify_1.default)({ errorCode, errorMessage })}`;
    if (errorCode > 0)
        info.level = 'notice';
    return info;
};
