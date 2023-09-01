import { MainClient } from "binance";

export const getCoinAsset = async (client: MainClient, symbol: string) => {
  const coin = process.env.BASE_COIN;

  const info = await client.getAccountInformation();
  const coinAsset = info.balances.find((c) => c.asset === coin);

  return coinAsset;
};
