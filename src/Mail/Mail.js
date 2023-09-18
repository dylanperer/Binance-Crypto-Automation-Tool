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
exports.startMailListener = void 0;
const AlertParser_1 = require("./AlertParser");
const MailConfiguration_1 = require("./settings/MailConfiguration");
//@ts-ignore
const mail_listener5_1 = require("mail-listener5");
const logger_1 = require("../logger");
const attachMailListener = (binanceClient) => __awaiter(void 0, void 0, void 0, function* () {
    const configuration = (0, MailConfiguration_1.getMailConfiguration)();
    const mailListener = new mail_listener5_1.MailListener(configuration);
    mailListener.start();
    mailListener.on("error", (ex) => {
        (0, logger_1.serverError)(logger_1.ModuleType.Mail, `Mail server connection error: ${ex.message}`);
        process.exit(1);
    });
    mailListener.on("server:connected", () => {
        (0, logger_1.serverVerbose)(logger_1.ModuleType.Mail, "Connection to mail server was successful.");
        mailListener.on("mail", (mail) => onMail(binanceClient, mail));
    });
});
const onMail = (binanceClient, mail) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, AlertParser_1.parseAlert)(binanceClient, mail === null || mail === void 0 ? void 0 : mail.text);
});
const startMailListener = (binanceClient, refreshFrequencyInMinutes) => __awaiter(void 0, void 0, void 0, function* () {
    yield attachMailListener(binanceClient);
    setInterval(() => attachMailListener(binanceClient), 1000 * 60 * refreshFrequencyInMinutes);
});
exports.startMailListener = startMailListener;
