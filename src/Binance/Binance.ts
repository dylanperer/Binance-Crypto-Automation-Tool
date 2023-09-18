import { MainClient, USDMClient } from "binance";
import { ModuleType, serverError, serverSuccess } from "../logger";
import { getTradeSettings } from "./TradeSettings";
import { findLowestAsk } from "./Market";
import { getCoinAsset } from "./Account";

export const getBinanceClient = async (): Promise<MainClient | null> => {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_SECRET_KEY;
  try {
    if (!apiKey || !apiSecret) {
      throw new Error(`Invalid api or secret key`);
    }
    const client = new MainClient({
      api_key: apiKey,
      api_secret: apiSecret,
      baseUrl: 'https://api3.binance.com'
    });

    const tradeSettings = getTradeSettings();

    findLowestAsk(client, tradeSettings.symbol);

    serverSuccess(ModuleType.Binance, "Connection to binance successful.");

    return client;
  } catch (exception: any) {
    serverError(
      ModuleType.Binance,
      `Connection to binance unsuccessful. exception:${exception.message}`
    );
  }
  return null;
};
