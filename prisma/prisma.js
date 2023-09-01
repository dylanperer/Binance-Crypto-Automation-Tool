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
exports.endPreviousSession = exports.getActiveSession = exports.createSession = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const createSession = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.session.create({ data: { hasEnded: "false" } });
});
exports.createSession = createSession;
const getActiveSession = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield exports.prisma.session.findFirst({
        where: {
            hasEnded: "false",
        },
    });
    return session;
});
exports.getActiveSession = getActiveSession;
const endPreviousSession = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.session.updateMany({
        data: {
            hasEnded: "true",
        },
    });
});
exports.endPreviousSession = endPreviousSession;
