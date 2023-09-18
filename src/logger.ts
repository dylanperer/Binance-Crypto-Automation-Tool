import chalk from "chalk";
import moment from "moment";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { getActiveSession, prisma } from "../prisma/prisma";
import { Log } from "@prisma/client";

export enum ModuleType {
  Mail = "Mail",
  Binance = "Binance",
  Server = "Server",
  Api = "Express",
  Database = "Database",
  Log = "Log",
}

export enum LogType {
  info = "[Info]",
  warn = "[Warning]",
  error = "[Error]",
  success = "[Successful]",
  verbose = "[Verbose]",
}

export interface IServerLog {
  module: ModuleType;
  context?: string;
  logLevel?: LogType;
}

export const clearLogs = async () => {
  try {
    await prisma.log.deleteMany();
    serverVerbose(ModuleType.Log, "Successfully cleared previous logs...");
  } catch (ex: any) {
    serverError(ModuleType.Log, `Failure clearing previous logs. ex:${ex.message}`);
  }
};

const writeServerLogToCsv = (serverLog: IServerLog, filePath: string): void => {
  const headerRow = "module,action,context,logLevel\n";
  const dataRow = `${serverLog.module},${serverLog.context ?? ""},${
    serverLog.logLevel ?? ""
  }\n`;

  // If the file already exists, append the data to it; otherwise, create a new file.
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, dataRow);
  } else {
    fs.writeFileSync(filePath, headerRow + dataRow);
  }
};

export const readServerLogFromCsv = async (
  filePath: string
): Promise<IServerLog[]> => {
  const serverLogs: IServerLog[] = [];

  // Read the CSV file
  const csvData = await fs.promises.readFile(filePath);

  // Parse the CSV data
  const records = await parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  // Convert each CSV record to an IServerLog object
  for await (const record of records) {
    const serverLog: IServerLog = {
      module: record.module,
      context: record.context || undefined,
      logLevel: record.logLevel || undefined,
    };
    serverLogs.push(serverLog);
  }

  return serverLogs;
};

const Log = (module: ModuleType, context?: string, logLevel?: LogType) => {
  const str = buildLogStr(module, logLevel, context);

  const _str = `> ${str}`;

  const isVerbose = process.env.VERBOSE === "true";

  switch (logLevel) {
    case LogType.error: {
      console.log(chalk.hex("#ff471a").bold(_str));
      break;
    }
    case LogType.warn: {
      console.log(chalk.hex("#ff8533").bold(_str));
      break;
    }
    case LogType.info: {
      console.log(chalk.hex("#00ccff").bgHex("#0d0d0d").bold(_str));
      break;
    }
    case LogType.success: {
      console.log(chalk.hex("#66ff99").bgHex("#0d0d0d").bold(_str));
      break;
    }
    case LogType.verbose: {
      if (isVerbose === true) {
        console.log(chalk.hex("#999999").bgHex("#0d0d0d").bold(_str));
      }
      break;
    }
  }
};

const createLog = (log: any): Promise<Log> => {
  return new Promise<Log>((resolve, reject) => {
    prisma.log
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

const buildLogStr = (
  module: ModuleType,
  logLevel?: LogType,
  context?: string
) => {
  const formattedTime = moment(new Date()).format("DD/MM/YYYY h:mm:ss");

  const str = `${formattedTime} [${module.toString()}] ${
    context ? context.concat(".") : ""
  }`;

  new Promise<Log>((resolve, reject) => {
    prisma.log
      .create({
        data: {
          module: module.toString(),
          action: "",
          logLevel: logLevel?.toString() || LogType.info.toString(),
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
    .then((user) => {})
    .catch((error) => {
      console.error("Log failed to be created", error);
    });

  return str;
};
export const serverError = (module: ModuleType, context?: string) => {
  Log(module, context, LogType.error);
};

export const serverInfo = (module: ModuleType, context?: string) => {
  Log(module, context, LogType.info);
};

export const serverWarn = (module: ModuleType, context?: string) => {
  Log(module, context, LogType.warn);
};

export const serverSuccess = (module: ModuleType, context?: string) => {
  Log(module, context, LogType.success);
};

export const serverVerbose = (module: ModuleType, context?: string) => {
  Log(module, context, LogType.verbose);
};
