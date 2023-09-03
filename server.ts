import dotenv from "dotenv";
import { startMailListener } from "./src/Mail/Mail";
import { getBinanceClient } from "./src/Binance/Binance";
import { ModuleType, serverError } from "./src/logger";
dotenv.config();

const configureServer = async () => {
  const MAIL_REFRESH_FREQUENCY = Number(process.env.MAIL_REFRESH_FREQUENCY);

  try {
    //validate env
    if (!MAIL_REFRESH_FREQUENCY) {
      throw new Error(`MAIL_REFRESH_FREQUENCY env variable is invalid`);
    }

    //connect to binance
    const binanceCLient = await getBinanceClient();

    if(!binanceCLient){
      throw new Error(`Null binance client was returned`);
    }
    //mail
    if (binanceCLient) {
      await startMailListener(binanceCLient, MAIL_REFRESH_FREQUENCY);
    }
    //  const a = getAlert(`{ "TICKER": "ETHUSDT", "INTERVAL": "1m", "TIME": "2023-08-31T00:30:00Z", "ACTION": "buy", "BAR": { "close": "100", "open": "80", "high": "120", "low": "72", "volume": "99999" } }`)

    //  console.log(a);
  } catch (error: any) {
    serverError(ModuleType.Server, `${error.message}`);
  }
};

const main = async () => {
  await configureServer();
};

main();
