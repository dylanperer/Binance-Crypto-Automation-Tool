import { MainClient } from "binance";
import { parseAlert } from "./AlertParser";
import { getMailConfiguration } from "./settings/MailConfiguration";
//@ts-ignore
import { MailListener } from "mail-listener5";
import { ModuleType, serverVerbose } from "../logger";

const attachMailListener = async (binanceClient: MainClient) => {
  const configuration = getMailConfiguration();

  const mailListener = new MailListener(configuration);

  mailListener.start();

  mailListener.on("error", () => process.exit(1));

  mailListener.on("server:connected", () => {
    serverVerbose(ModuleType.Mail, 'Connection to mail server was successful.');
    mailListener.on("mail", (mail: any) => onMail(binanceClient, mail));
  });
};

const onMail = async (binanceClient: MainClient, mail: any) => {
  await parseAlert(binanceClient, mail?.text);
};

export const startMailListener = async (
  binanceClient: MainClient,
  refreshFrequencyInMinutes: number
) => {
  await attachMailListener(binanceClient);

  setInterval(
    () => attachMailListener(binanceClient),
    1000 * 60 * refreshFrequencyInMinutes
  );
};
