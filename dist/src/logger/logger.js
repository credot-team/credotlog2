"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivideLogger = void 0;
const events_1 = __importDefault(require("events"));
class DivideLogger {
    constructor(logger, subLogger, levelMapping) {
        this.emitter = new events_1.default();
        const self = this;
        // 產生與各 level 對應的快捷 method ( ex. this.err(), this.info() )
        Object.keys(logger.levels).forEach((k) => {
            self[k] = ((message, others) => {
                self.log(k, message, others);
            });
        });
        this.baseLogger = logger;
        this.subLogger = subLogger;
        // TODO 考慮將下面兩個設定成可自定義
        const errorLevel = levelMapping.err;
        const warningLevel = levelMapping.warning;
        // create 'warn', 'error' events
        logger.on('warn', (err) => {
            this.emitter.emit('warn', err);
            subLogger.log(warningLevel, err instanceof Error ? err.stack : err);
        });
        logger.on('error', (err) => {
            this.emitter.emit('warn', err);
            subLogger.log(errorLevel, err.stack);
        });
        subLogger.on('error', (err) => {
            this.emitter.emit('error', err);
        });
        // create 'log' event
        logger.on('data', (chunk) => {
            this.fireLogEvent(chunk);
        });
        subLogger.on('data', (chunk) => {
            this.fireLogEvent(chunk);
        });
    }
    fireLogEvent(info) {
        this.emitter.emit('log', info.level, info);
    }
    on(...args) {
        this.emitter.on(...args);
        return this;
    }
    off(...args) {
        this.emitter.off(...args);
        return this;
    }
    log(level, message, others) {
        this.baseLogger.log(level, message, others);
    }
    levels() {
        return this.baseLogger.levels;
    }
}
exports.DivideLogger = DivideLogger;
