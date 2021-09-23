"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("./middleware");
const express = {
    logging: middleware_1.logging,
};
exports.default = express;
