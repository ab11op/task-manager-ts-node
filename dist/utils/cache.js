"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTaskCache = exports.generateTasksCacheKey = void 0;
const redis_1 = require("./redis");
const generateTasksCacheKey = (req) => {
    const { status, dueDate } = req.query;
    let key = 'tasks_cache';
    if (status)
        key += `:status=${status}`;
    if (dueDate)
        key += `:dueDate=${dueDate}`;
    return key;
};
exports.generateTasksCacheKey = generateTasksCacheKey;
const clearTaskCache = () => __awaiter(void 0, void 0, void 0, function* () {
    const keys = yield redis_1.redisClient.keys('tasks_cache*');
    if (keys.length > 0) {
        yield redis_1.redisClient.del(keys);
    }
});
exports.clearTaskCache = clearTaskCache;
