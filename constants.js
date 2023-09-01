"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeStatus = exports.Market = exports.TradeSide = exports.AlertAction = void 0;
var AlertAction;
(function (AlertAction) {
    AlertAction["Long"] = "LONG";
    AlertAction["Short"] = "SHORT";
    AlertAction["StopLossShort"] = "STOP LOSS SHORT";
    AlertAction["StopLossLong"] = "STOP LOSS LONG";
})(AlertAction = exports.AlertAction || (exports.AlertAction = {}));
var TradeSide;
(function (TradeSide) {
    TradeSide["Long"] = "LONG";
    TradeSide["Short"] = "SHORT";
})(TradeSide = exports.TradeSide || (exports.TradeSide = {}));
var Market;
(function (Market) {
    Market["Futures"] = "Futures";
})(Market = exports.Market || (exports.Market = {}));
var TradeStatus;
(function (TradeStatus) {
    TradeStatus["Active"] = "Active";
    TradeStatus["Complete"] = "Complete";
    TradeStatus["Unsuccessful"] = "Unsuccessful";
    TradeStatus["Processing"] = "Processing";
})(TradeStatus = exports.TradeStatus || (exports.TradeStatus = {}));
