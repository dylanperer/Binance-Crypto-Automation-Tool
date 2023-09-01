import { MainClient } from "binance";
import { parseAlert } from "./AlertParser";
import { getMailConfiguration } from "./MailConfiguration";
//@ts-ignore
import { MailListener } from "mail-listener5";

const attachMailListener = async (binanceClient: MainClient) => {
  const configuration = getMailConfiguration();

  const mailListener = new MailListener(configuration);

  mailListener.start();

  mailListener.on("error", () => attachMailListener(binanceClient));

  mailListener.on("server:connected", () => {
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
