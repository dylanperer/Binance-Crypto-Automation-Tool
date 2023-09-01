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
exports.parseAlert = exports.getAlert = void 0;
const prisma_1 = require("../../prisma/prisma");
const logger_1 = require("../logger");
const Market_1 = require("../Binance/Market");
const TradeSettings_1 = require("../Binance/TradeSettings");
const getAlert = (subject) => {
    try {
        return JSON.parse(subject);
    }
    catch (error) {
        throw new Error(`Failed to dieselize ${subject} as a alert; ex${error}`);
    }
};
exports.getAlert = getAlert;
const parseAlert = (binanceClient, rawText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!binanceClient) {
            throw new Error("alert cannot be parsed with null binanceClient");
        }
        if (!rawText) {
            throw new Error("Cannot dieselize any empty raw text...");
        }
        const parsedMessageAsAlert = (0, exports.getAlert)(rawText);
        if (!parsedMessageAsAlert) {
            return;
        }
        const { TIME } = parsedMessageAsAlert;
        const receivedAt = new Date(TIME);
        const delay = new Date().getTime() - receivedAt.getTime();
        const diffInSeconds = Math.floor(delay / 1000);
        const alert = yield createAlert(binanceClient, rawText, parsedMessageAsAlert, receivedAt, diffInSeconds);
        if (alert === null || alert === void 0 ? void 0 : alert.uid) {
            (0, logger_1.serverInfo)(logger_1.ModuleType.Mail, logger_1.ActionType.alertCreation, `${JSON.stringify(alert)}`);
            console.log("@TODO");
        }
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Mail, logger_1.ActionType.alertParse, error.message);
    }
});
exports.parseAlert = parseAlert;
const createAlert = (binanceClient, rawText, dieselize, receivedAt, delay) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { TIME, TICKER, ACTION } = dieselize;
        return yield prisma_1.prisma.$transaction((_tx) => __awaiter(void 0, void 0, void 0, function* () {
            const createdAlert = yield _tx.alert.create({
                data: {
                    uid: TIME,
                    coin: TICKER,
                    side: ACTION,
                    price: -1,
                    rawMessage: rawText,
                    tradeComplete: false,
                    receivedAt: receivedAt,
                    createdAt: new Date(),
                    delay: delay,
                },
            });
            const { symbol } = (0, TradeSettings_1.getTradeSettings)();
            const lowest = yield (0, Market_1.findLowestAsk)(binanceClient, symbol);
            (0, logger_1.serverVerbose)(logger_1.ModuleType.Binance, logger_1.ActionType.findLowestAsk, `${lowest}`);
            const updatedAlert = yield _tx.alert.update({
                where: { uid: createdAlert.uid },
                data: {
                    price: Number(lowest === null || lowest === void 0 ? void 0 : lowest.toString()),
                },
            });
            return updatedAlert;
        }));
    }
    catch (error) {
        if (error.code === "P2002") {
            (0, logger_1.serverVerbose)(logger_1.ModuleType.Mail, logger_1.ActionType.alertParse, `Duplicate alert - ignoring...`);
        }
        else {
            (0, logger_1.serverError)(logger_1.ModuleType.Mail, logger_1.ActionType.alertCreation, error.message);
        }
    }
});
//     prisma.alert.create({
//       data: {
//         uid: TIME,
//         coin: TICKER,
//         side: ACTION,
//         price: -1,
//         rawMessage: rawText,
//         tradeComplete: false,
//         receivedAt: receivedAt,
//         createdAt: new Date(),
//         delay: delay,
//       },
//     }),
//     new Promise(async (resolve, reject) => {
//       try {
//         const { symbol } = getTradeSettings();
//         const lowest = await findLowestAsk(binanceClient, symbol);
//         serverVerbose(
//           ModuleType.Binance,
//           ActionType.findLowestAsk,
//           `${lowest}`
//         );
//       } catch (error: any) {
//         throw new Error(
//           `Critical! Failed to get price-book to create alert ${error.message}`
//         );
//       }
//     })
//   )
//   ]);
//   console.log("Transaction completed successfully.");
// } catch (error) {
//   console.error("Error performing transaction:", error);
// }
