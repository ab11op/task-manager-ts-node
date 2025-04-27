"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const { method, originalUrl, body } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${originalUrl}`);
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        console.log('Request Body:', JSON.stringify(body));
    }
    next();
};
exports.requestLogger = requestLogger;
