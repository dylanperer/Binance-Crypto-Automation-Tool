import { MainClient } from "binance";
import { ModuleType, serverError, serverVerbose } from "../logger";

export const findLowestAsk = async (client: MainClient, symbol: string) => {
  try {
    const orderBook = await client.getOrderBook({
      symbol: symbol,
      limit: 500,
    });

    const asks = orderBook.asks;
    let lowestAsk = asks[0];

    for (let i = 1; i < asks.length; i++) {
      const currentAsk = asks[i];
      if (currentAsk[0] < lowestAsk[0]) {
        lowestAsk = currentAsk;
      }
    }

    serverVerbose(
      ModuleType.Binance,
      `Request to finding lowest ask was successful ${lowestAsk[0]}`
    );
    return lowestAsk[0];
  } catch (exception: any) {
    serverError(
      ModuleType.Binance,
      `Request to finding lowest ask was unsuccessful. Exception: ${exception.message}`
    );
  }
};
