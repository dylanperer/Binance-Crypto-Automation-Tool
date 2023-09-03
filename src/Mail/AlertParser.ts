import { prisma } from "../../prisma/prisma";
import { Alert, Prisma, PrismaClient } from "@prisma/client";
import { ModuleType, serverError, serverInfo, serverVerbose } from "../logger";
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
        `Alert creation was successful. info: ${JSON.stringify(alert)}`
      );

      console.log("@TODO");
    }
  } catch (exception: any) {
    serverError(
      ModuleType.Mail,
      `Alert creation was unsuccessful. Exception: ${exception.message}`
    );
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

      const updatedAlert = await _tx.alert.update({
        where: { uid: createdAlert.uid },
        data: {
          price: Number(lowest?.toString()),
        },
      });

      return updatedAlert;
    });
  } catch (exception: any) {
    if (exception.code === "P2002") {
      serverVerbose(ModuleType.Mail, `Duplicate alert - ignoring...`);
    } else {
      serverError(
        ModuleType.Mail,
        `Alert creation was unsuccessful. Exception: ${exception.message}`
      );
    }
  }
};
