"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const logform_1 = require("logform");
var format;
(function (format) {
    format.timestamp = (0, logform_1.format)((info) => {
        info.message = `[${new Date().toISOString()}] ${info.message}`;
        return info;
    });
    format.errors = (0, logform_1.format)((info) => {
        if (!(info.exception && info.error))
            return info;
        info.message = info.error.stack;
        return {
            level: info.level,
            message: info.message,
            [Symbol.for('level')]: info.level,
            [Symbol.for('message')]: info.message,
        };
    });
    format.debugInfo = (0, logform_1.format)((info) => {
        console.log('[winston] format debugger: ', info);
        return info;
    });
})(format || (exports.format = format = {}));
