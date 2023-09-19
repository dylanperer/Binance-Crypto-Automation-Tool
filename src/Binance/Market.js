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
exports.getPriceTicker = exports.findLowestAsk = void 0;
const logger_1 = require("../logger");
const findLowestAsk = (client, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderBook = yield client.getOrderBook({
            symbol: symbol,
            limit: 500,
        });
        const asks = orderBook.asks;
        let lowestAsk = asks[0];
        for (let i = 1; i < asks.length; i++) {
            const currentAsk = asks[i];
            if (currentAsk[0] < lowestAsk[0]) {
                lowestAsk = currentAsk;
            }
        }
        (0, logger_1.serverVerbose)(logger_1.ModuleType.Binance, `Request to finding lowest ask was successful ${lowestAsk[0]}`);
        return lowestAsk[0];
    }
    catch (exception) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, `Request to finding lowest ask was unsuccessful. Exception: ${exception.message}`);
    }
});
exports.findLowestAsk = findLowestAsk;
const getPriceTicker = (client, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticker = yield client.getSymbolPriceTicker({ symbol: symbol });
        ticker.price;
        (0, logger_1.serverVerbose)(logger_1.ModuleType.Binance, `Request to get price ticker was successful ${ticker.price}`);
        return ticker.price;
    }
    catch (exception) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, `Request to get price ticker was unsuccessful. Exception: ${exception.message}`);
    }
});
exports.getPriceTicker = getPriceTicker;
