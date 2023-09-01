import { MainClient } from "binance";
import { ActionType, ModuleType, serverError } from "../logger";

export const findLowestAsk = async (client: MainClient, symbol: string) => {
  try {
    const orderBook = await client.getOrderBook({
      symbol: symbol,
      limit: 500,
    });

    if (!orderBook || !orderBook.asks || orderBook.asks.length === 0) {
      throw new Error("fetching order book error");
    }

    const asks = orderBook.asks;
    let lowestAsk = asks[0];

    for (let i = 1; i < asks.length; i++) {
      const currentAsk = asks[i];
      if (currentAsk[0] < lowestAsk[0]) {
        lowestAsk = currentAsk;
      }
    }

    return lowestAsk[0];
  } catch (e:any) {
    serverError(ModuleType.Binance, ActionType.findLowestAsk, `${e.message}`)
  }
};
