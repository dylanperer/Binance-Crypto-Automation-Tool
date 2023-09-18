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
exports.getBinanceClient = void 0;
const binance_1 = require("binance");
const logger_1 = require("../logger");
const TradeSettings_1 = require("./TradeSettings");
const Market_1 = require("./Market");
const getBinanceClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_SECRET_KEY;
    try {
        if (!apiKey || !apiSecret) {
            throw new Error(`Invalid api or secret key`);
        }
        const client = new binance_1.MainClient({
            api_key: apiKey,
            api_secret: apiSecret,
            baseUrl: 'https://api3.binance.com'
        });
        const tradeSettings = (0, TradeSettings_1.getTradeSettings)();
        (0, Market_1.findLowestAsk)(client, tradeSettings.symbol);
        (0, logger_1.serverSuccess)(logger_1.ModuleType.Binance, "Connection to binance successful.");
        return client;
    }
    catch (exception) {
        (0, logger_1.serverError)(logger_1.ModuleType.Binance, `Connection to binance unsuccessful. exception:${exception.message}`);
    }
    return null;
});
exports.getBinanceClient = getBinanceClient;
