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
exports.archiveLogs = void 0;
const prisma_1 = require("../prisma/prisma");
const logger_1 = require("./logger");
const archiveLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('hi', prisma_1.prisma);
        const currentLogs = yield prisma_1.prisma.log.findMany();
        // const archivedLogs = await prisma.archiveLogs.create({
        //   data: {
        //     logs: {
        //       create: currentLogs,
        //     },
        //   },
        // });
        console.log('hi2', currentLogs);
        // serverInfo(
        //   ModuleType.Database,
        //   ActionType.databaseInsert,
        //   `Created new ArchiveLogs record with ID ${archivedLogs.id}`
        // );
    }
    catch (error) {
        (0, logger_1.serverError)(logger_1.ModuleType.Server, logger_1.ActionType.serverError, error.message);
    }
});
exports.archiveLogs = archiveLogs;
