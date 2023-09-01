"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeSettings = void 0;
const getTradeSettings = () => {
    const baseCoin = process.env.BASE_COIN;
    const symbol = process.env.SYMBOL;
    const margin = process.env.MARGIN;
    if (!baseCoin) {
        throw new Error(`Invalid base coin configuration`);
    }
    if (!symbol) {
        throw new Error(`Invalid base coin configuration`);
    }
    if (!margin) {
        throw new Error(`Invalid margin configuration`);
    }
    const tradeSettings = {
        baseCoin,
        symbol,
        margin,
    };
    return tradeSettings;
};
exports.getTradeSettings = getTradeSettings;
