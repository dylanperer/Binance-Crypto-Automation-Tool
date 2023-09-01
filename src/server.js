"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const healthController_1 = require("./api/healthController");
const mail_1 = require("./mail/mail");
const logger_1 = require("./logger/logger");
dotenv_1.default.config();
const CURRENT_LOGS = [
    {
        module: logger_1.ServerModuleType.Mail,
        action: logger_1.MailActionType.attachListener,
        context: "",
        logLevel: logger_1.LogType.success,
    },
];
(0, healthController_1.startExpress)(CURRENT_LOGS);
(0, mail_1.addMailListener)(process.env.EMAIL_ADDRESS || "", process.env.EMAIL_PASSWORD || "");
