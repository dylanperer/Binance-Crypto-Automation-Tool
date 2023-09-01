import { MainClient, USDMClient } from "binance";
import { ActionType, ModuleType, serverError, serverSuccess } from "../logger";
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
    });

    const tradeSettings  = getTradeSettings();

    findLowestAsk(client, tradeSettings.symbol);

    serverSuccess(ModuleType.Binance, ActionType.connectBinance);

    return client;
  } catch (e: any) {
    serverError(ModuleType.Binance, ActionType.connectBinance, e.message);
  }
  return null;
};
