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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Mail_1 = require("./src/Mail/Mail");
const Binance_1 = require("./src/Binance/Binance");
const logger_1 = require("./src/logger");
dotenv_1.default.config();
const configureServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const MAIL_REFRESH_FREQUENCY = Number(process.env.MAIL_REFRESH_FREQUENCY);
    try {
        //validate env
        if (!MAIL_REFRESH_FREQUENCY) {
            throw new Error(`MAIL_REFRESH_FREQUENCY env variable is invalid`);
        }
        //connect to binance
        const binanceCLient = yield (0, Binance_1.getBinanceClient)();
        if (!binanceCLient) {
            throw new Error(`Null binance client was returned`);
        }
        //mail
        if (binanceCLient) {
            yield (0, Mail_1.startMailListener)(binanceCLient, MAIL_REFRESH_FREQUENCY);
        }
        //  const a = getAlert(`{ "TICKER": "ETHUSDT", "INTERVAL": "1m", "TIME": "2023-08-31T00:30:00Z", "ACTION": "buy", "BAR": { "close": "100", "open": "80", "high": "120", "low": "72", "volume": "99999" } }`)
        //  console.log(a);
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Server, `${error.message}`);
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield configureServer();
});
main();
