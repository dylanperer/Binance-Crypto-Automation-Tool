import { prisma } from "../../prisma/prisma";
import { Alert, Prisma, PrismaClient } from "@prisma/client";
import {
  ActionType,
  ModuleType,
  serverError,
  serverInfo,
  serverVerbose,
} from "../logger";
import { MainClient } from "binance";
import { findLowestAsk } from "../Binance/Market";
import { getTradeSettings } from "../Binance/TradeSettings";
import { deserialize } from "v8";

type AlertDieselize = {
  TICKER: string;
  INTERVAL: string;
  TIME: Date;
  ACTION: string;
  BAR: {
    close: string;
    open: string;
    high: string;
    low: string;
    volume: string;
  };
};

export const getAlert = (subject: string): AlertDieselize | null => {
  try {
    return JSON.parse(subject) as AlertDieselize;
  } catch (error) {
    throw new Error(`Failed to dieselize ${subject} as a alert; ex${error}`);
  }
};

export const parseAlert = async (
  binanceClient: MainClient,
  rawText?: string
) => {
  try {
    if (!binanceClient) {
      throw new Error("alert cannot be parsed with null binanceClient");
    }

    if (!rawText) {
      throw new Error("Cannot dieselize any empty raw text...");
    }

    const parsedMessageAsAlert = getAlert(rawText);

    if (!parsedMessageAsAlert) {
      return;
    }

    const { TIME } = parsedMessageAsAlert;

    const receivedAt = new Date(TIME);

    const delay = new Date().getTime() - receivedAt.getTime();
    const diffInSeconds = Math.floor(delay / 1000);

    const alert = await createAlert(
      binanceClient,
      rawText,
      parsedMessageAsAlert,
      receivedAt,
      diffInSeconds
    );

    if (alert?.uid) {
      serverInfo(
        ModuleType.Mail,
        ActionType.alertCreation,
        `${JSON.stringify(alert)}`
      );

      console.log("@TODO");
    }
  } catch (error: any) {
    serverError(ModuleType.Mail, ActionType.alertParse, error.message);
  }
};

const createAlert = async (
  binanceClient: MainClient,
  rawText: string,
  dieselize: AlertDieselize,
  receivedAt: Date,
  delay: number
) => {
  try {
    const { TIME, TICKER, ACTION } = dieselize;

    return await prisma.$transaction(async (_tx) => {
      const createdAlert = await _tx.alert.create({
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

      const { symbol } = getTradeSettings();

      const lowest = await findLowestAsk(binanceClient, symbol);
      serverVerbose(ModuleType.Binance, ActionType.findLowestAsk, `${lowest}`);

      const updatedAlert = await _tx.alert.update({
        where: { uid: createdAlert.uid },
        data: {
          price: Number(lowest?.toString()),
        },
      });

      return updatedAlert;
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      serverVerbose(
        ModuleType.Mail,
        ActionType.alertParse,
        `Duplicate alert - ignoring...`
      );
    } else {
      serverError(ModuleType.Mail, ActionType.alertCreation, error.message);
    }
  }
};
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
