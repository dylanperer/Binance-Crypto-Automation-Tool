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
exports.startExpress = void 0;
const express_1 = __importDefault(require("express"));
const logger_service_1 = require("../logger.service");
const prisma_1 = require("../../prisma/prisma");
const logger_service_2 = require("../logger.service");
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("OK");
    }
    catch (error) {
        (0, logger_service_1.serverError)(logger_service_2.ModuleType.Api, logger_service_2.ActionType.apiEndpoint, '/');
    }
}));
app.get("/logs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send(yield prisma_1.prisma.log.findMany());
    }
    catch (error) {
        (0, logger_service_1.serverError)(logger_service_2.ModuleType.Api, logger_service_2.ActionType.apiEndpoint, '/logs');
    }
}));
const startExpress = () => {
    const port = process.env.PORT;
    app.listen(port, () => {
        (0, logger_service_1.serverSuccess)(logger_service_2.ModuleType.Api, logger_service_2.ActionType.apiStarted, `Port:${port}`);
    });
};
exports.startExpress = startExpress;
