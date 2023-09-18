"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverVerbose = exports.serverSuccess = exports.serverWarn = exports.serverInfo = exports.serverError = exports.readServerLogFromCsv = exports.clearLogs = exports.LogType = exports.ModuleType = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
const csv_parse_1 = require("csv-parse");
const prisma_1 = require("../prisma/prisma");
var ModuleType;
(function (ModuleType) {
    ModuleType["Mail"] = "Mail";
    ModuleType["Binance"] = "Binance";
    ModuleType["Server"] = "Server";
    ModuleType["Api"] = "Express";
    ModuleType["Database"] = "Database";
    ModuleType["Log"] = "Log";
})(ModuleType = exports.ModuleType || (exports.ModuleType = {}));
var LogType;
(function (LogType) {
    LogType["info"] = "[Info]";
    LogType["warn"] = "[Warning]";
    LogType["error"] = "[Error]";
    LogType["success"] = "[Successful]";
    LogType["verbose"] = "[Verbose]";
})(LogType = exports.LogType || (exports.LogType = {}));
const clearLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.prisma.log.deleteMany();
        (0, exports.serverVerbose)(ModuleType.Log, "Successfully cleared previous logs...");
    }
    catch (ex) {
        (0, exports.serverError)(ModuleType.Log, `Failure clearing previous logs. ex:${ex.message}`);
    }
});
exports.clearLogs = clearLogs;
const writeServerLogToCsv = (serverLog, filePath) => {
    var _a, _b;
    const headerRow = "module,action,context,logLevel\n";
    const dataRow = `${serverLog.module},${(_a = serverLog.context) !== null && _a !== void 0 ? _a : ""},${(_b = serverLog.logLevel) !== null && _b !== void 0 ? _b : ""}\n`;
    // If the file already exists, append the data to it; otherwise, create a new file.
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, dataRow);
    }
    else {
        fs.writeFileSync(filePath, headerRow + dataRow);
    }
};
const readServerLogFromCsv = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const serverLogs = [];
    // Read the CSV file
    const csvData = yield fs.promises.readFile(filePath);
    // Parse the CSV data
    const records = yield (0, csv_parse_1.parse)(csvData, {
        columns: true,
        skip_empty_lines: true,
    });
    try {
        // Convert each CSV record to an IServerLog object
        for (var _d = true, records_1 = __asyncValues(records), records_1_1; records_1_1 = yield records_1.next(), _a = records_1_1.done, !_a;) {
            _c = records_1_1.value;
            _d = false;
            try {
                const record = _c;
                const serverLog = {
                    module: record.module,
                    context: record.context || undefined,
                    logLevel: record.logLevel || undefined,
                };
                serverLogs.push(serverLog);
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = records_1.return)) yield _b.call(records_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return serverLogs;
});
exports.readServerLogFromCsv = readServerLogFromCsv;
const Log = (module, context, logLevel) => {
    const str = buildLogStr(module, logLevel, context);
    const _str = `> ${str}`;
    const isVerbose = process.env.VERBOSE === "true";
    switch (logLevel) {
        case LogType.error: {
            console.log(chalk_1.default.hex("#ff471a").bold(_str));
            break;
        }
        case LogType.warn: {
            console.log(chalk_1.default.hex("#ff8533").bold(_str));
            break;
        }
        case LogType.info: {
            console.log(chalk_1.default.hex("#00ccff").bgHex("#0d0d0d").bold(_str));
            break;
        }
        case LogType.success: {
            console.log(chalk_1.default.hex("#66ff99").bgHex("#0d0d0d").bold(_str));
            break;
        }
        case LogType.verbose: {
            if (isVerbose === true) {
                console.log(chalk_1.default.hex("#999999").bgHex("#0d0d0d").bold(_str));
            }
            break;
        }
    }
};
const createLog = (log) => {
    return new Promise((resolve, reject) => {
        prisma_1.prisma.log
            .create({
            data: log,
        })
            .then((createdUser) => {
            resolve(createdUser);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
const buildLogStr = (module, logLevel, context) => {
    const formattedTime = (0, moment_1.default)(new Date()).format("DD/MM/YYYY h:mm:ss");
    const str = `${formattedTime} [${module.toString()}] ${context ? context.concat(".") : ""}`;
    new Promise((resolve, reject) => {
        prisma_1.prisma.log
            .create({
            data: {
                module: module.toString(),
                action: "",
                logLevel: (logLevel === null || logLevel === void 0 ? void 0 : logLevel.toString()) || LogType.info.toString(),
                context: context || null,
            },
        })
            .then((createdUser) => {
            resolve(createdUser);
        })
            .catch((error) => {
            reject(error);
        });
    })
        .then((user) => { })
        .catch((error) => {
        console.error("Log failed to be created", error);
    });
    return str;
};
const serverError = (module, context) => {
    Log(module, context, LogType.error);
};
exports.serverError = serverError;
const serverInfo = (module, context) => {
    Log(module, context, LogType.info);
};
exports.serverInfo = serverInfo;
const serverWarn = (module, context) => {
    Log(module, context, LogType.warn);
};
exports.serverWarn = serverWarn;
const serverSuccess = (module, context) => {
    Log(module, context, LogType.success);
};
exports.serverSuccess = serverSuccess;
const serverVerbose = (module, context) => {
    Log(module, context, LogType.verbose);
};
exports.serverVerbose = serverVerbose;
