"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const logger = __1.default.create({
    consoleLogLevel: 'info',
    infoOut: './logs/log.log',
    errorOut: './logs/error.log',
    graylog: {
        level: 'warning',
        server: { host: 'https://graylog.credot.ml/', port: 443 },
        hostname: 'credotlog-test',
    },
    exceptionLevel: 'debug',
});
const app = (0, express_1.default)();
app.use(__1.default.express.logging({ logger: logger }));
app.all('/test', (req, res) => {
    res.json({ errorCode: 0, errorMessage: 'success' });
    res.end();
});
app.all('/test-400', (req, res) => {
    res.status(400).end();
});
app.all('/test-500', (req, res) => {
    res.status(500).end();
});
app.all('/test-error', (req, res) => {
    res.json({ errorCode: 1005, errorMessage: 'test error' });
    res.end();
});
app.all('/log/:level', (req, res) => {
    const level = req.params.level;
    // @ts-ignore
    logger.log(level, 'test message');
    res.end();
});
http.createServer(app).listen(8880, () => {
    console.log('server on');
});
