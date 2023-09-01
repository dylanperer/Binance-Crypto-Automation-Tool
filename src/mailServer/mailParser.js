"use strict";
// import { getActiveSession, prisma } from "../../prisma/prisma";
// import {
//   ActionType,
//   ModuleType,
//   serverError,
//   serverInfo,
// } from "../logger";
// const alertAlreadyExists = async (uid: number): Promise<boolean> => {
//   const alert = await prisma.alert.findUnique({
//     where: { uid },
//   });
//   return alert ? true : false;
// };
// interface AlertMessage {
//   ID: string;
//   TICKER: string;
//   TIME: string;
//   SIDE: string;
//   PRICE: string;
//   CONTRACTS: string;
// }
// const parseMessageToAlert = (message?: string): AlertMessage | null => {
//   try {
//     if (!message) {
//       throw new Error("No message to parse as a json");
//     }
//     return JSON.parse(message) as AlertMessage;
//   } catch (error) {
//     return null;
//   }
// };
// const parseAlert = async (subject: string, uid: number) => {
//   try {
//     const parsedMessageAsAlert = parseMessageToAlert(subject);
//     if (!parsedMessageAsAlert) {
//       throw new Error("Failed to parse email as a alert json");
//     }
//     const { ID, TICKER, TIME, SIDE, PRICE, CONTRACTS } = parsedMessageAsAlert;
//     const receivedAt = new Date(TIME);
//     const delay = new Date().getTime() - receivedAt.getTime();
//     const diffInSeconds = Math.floor(delay / 1000);
//     const exists = await alertAlreadyExists(uid);
//     if (exists) {
//       throw new Error(
//         `Dup alert - ignoring... ${TIME}, ${TICKER}, ${SIDE}, ${PRICE}`
//       );
//     }
//     if (!exists) {
//       return await prisma.alert.create({
//         data: {
//           uid: uid,
//           coin: TICKER,
//           side: SIDE,
//           price: Number(PRICE),
//           receivedAt: receivedAt,
//           delay: diffInSeconds,
//         },
//       });
//     }
//   } catch (error: any) {
//     serverError(
//       ModuleType.Mail,
//       ActionType.alertParse,
//       `uid:${uid} Subject:${subject}, error:${error.message}`
//     );
//   }
// };
// export const onMail = async (mail: any, seqno: any, attributes: any) => {
//   console.log(attributes)
//   // const session = await getActiveSession();
//   // if (session && mail.date > session.createdAt) {
//   //   const alert = await parseAlert(mail.subject, attributes.uid);
//   //   if (alert) {
//   //     const alertStr = `${alert.delay}s, ${alert.receivedAt}, ${alert.side}, ${alert.coin}, ${alert.price}`;
//   //     serverInfo(ModuleType.Mail, ActionType.onReceiveMail, `${alertStr}`);
//   //   }
//   // }
// };
