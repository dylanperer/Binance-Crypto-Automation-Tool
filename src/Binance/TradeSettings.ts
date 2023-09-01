import { serverSuccess, ModuleType, ActionType, serverError } from "../logger";

export interface ITradeSettings {
  baseCoin: string;
  symbol: string;
  margin: string;
}

export const getTradeSettings = (): ITradeSettings => {
  const baseCoin = process.env.BASE_COIN;
  const symbol = process.env.SYMBOL;
  const margin = process.env.MARGIN;
  if (!baseCoin) {
    throw new Error(`Invalid base coin configuration`);
  }
  if (!symbol) {
    throw new Error(`Invalid base coin configuration`);
  }
  if (!margin) {
    throw new Error(`Invalid margin configuration`);
  }
  const tradeSettings: ITradeSettings = {
    baseCoin,
    symbol,
    margin,
  };
  return tradeSettings;
};
