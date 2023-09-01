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
exports.findLowestAsk = void 0;
const logger_1 = require("../logger");
const findLowestAsk = (client, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderBook = yield client.getOrderBook({
            symbol: symbol,
            limit: 500,
        });
        if (!orderBook || !orderBook.asks || orderBook.asks.length === 0) {
            throw new Error("fetching order book error");
        }
        const asks = orderBook.asks;
        let lowestAsk = asks[0];
        for (let i = 1; i < asks.length; i++) {
            const currentAsk = asks[i];
            if (currentAsk[0] < lowestAsk[0]) {
                lowestAsk = currentAsk;
            }
        }
        return lowestAsk[0];
    }
    catch (e) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, logger_1.ActionType.findLowestAsk, `${e.message}`);
    }
});
exports.findLowestAsk = findLowestAsk;