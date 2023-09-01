// //@ts-ignore
// import { MailListener } from "mail-listener5";
// import moment from "moment";
// import { prisma, getActiveSession } from '../prisma/prisma';
// import { serverWarn } from "./logger";
// let _MAIL_LISTENER_REFRESH_ATTEMPTS = 2;

// import {
//   LogType,
//   ActionType,
//   ModuleType,
//   serverInfo,
//   serverError,
//   serverSuccess,
// } from "./logger";
// import { AlertAction } from "../constants";

// const options = {
//   username: "imap-username",
//   password: "imap-password",
//   host: "outlook.office365.com",
//   port: 993, // imap port
//   tls: true,
//   connTimeout: 10000, // Default by node-imap
//   authTimeout: 5000, // Default by node-imap,
//   debug: null, // Or your custom function with only one incoming argument. Default: null
//   autotls: "never", // default by node-imap
//   tlsOptions: { rejectUnauthorized: false },
//   mailbox: "INBOX", // mailbox to monitor
//   searchFilter: ["ALL"], // the search filter being used after an IDLE notification has been retrieved
//   markSeen: true, // all fetched email willbe marked as seen and not fetched next time
//   fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
//   attachments: false, // download attachments as they are encountered to the project directory
// };

// const onMail = async (
//   mail: any,
//   seqno: any,
//   attributes: any,
// ) => {
//   const session = await getActiveSession()
//   if (session && mail.date > session.createdAt) {
//     const alert = await parseAlert(mail.subject, attributes.uid);
//     if (alert) {
//       const alertStr = `${alert.delay}s, ${alert.receivedAt}, ${alert.side}, ${alert.coin}, ${alert.price}`;

//       serverInfo(ModuleType.Mail, ActionType.onReceiveMail, `${alertStr}`);
//     }
//   }
// };

// const onError = async (error: any) => {
//   serverError(
//     ModuleType.Mail,
//     ActionType.mailError,
//     `${error.toString()}, ${error.message}`
//   );

//   serverInfo(
//     ModuleType.Mail,
//     ActionType.mailRestart,
//     `restarting, attempts remaining ${_MAIL_LISTENER_REFRESH_ATTEMPTS}...`
//   );

//   _MAIL_LISTENER_REFRESH_ATTEMPTS -= 1;

//   addMailListener();
// };

// const isAlertExist = async (uid: number): Promise<boolean> => {
//   const alert = await prisma.alert.findUnique({
//     where: { uid },
//   });
//   return alert? true: false;
// };
// const parseAlert = async (subject: string, uid: number) => {
//   //Alert: 2023-04-27T06:14:00Z,LONG,buy ETHUSDT.P,1898.54,0.03
//   try {
//     const split = subject.split(",");

//     const receivedAt = new Date(split[0].replace("Alert:", "").trim());
//     const side = split[1].trim().toUpperCase() as AlertAction;
//     const coin = split[2].replace("buy", "").trim();
//     const price = Number(split[3]);

//     // console.log(receivedAt, side, coin, price);

//     if (subject.toLowerCase().includes("alert")) {
//       if (!receivedAt || !side || !price) {
//         throw new Error("Alert parsing failed");
//       }
//     }

//     const delay = new Date().getTime() - receivedAt.getTime();
//     const diffInSeconds = Math.floor(delay / 1000);

//     const exists = await isAlertExist(uid);

//     if(!exists){
//       return await prisma.alert.create({
//         data: {
//           uid: uid,
//           coin: coin,
//           side: side,
//           price: price,
//           receivedAt: receivedAt,
//           delay: diffInSeconds,
//         },
//       });
//     } 
//   } catch (error: any) {
//     if(error.message === `Cannot read properties of undefined (reading 'trim')`){
//       serverWarn(
//         ModuleType.Mail,
//         ActionType.alertParse,
//         `Not an alert, received: ${uid}, ${subject}`
//       );
//       return;
//     }
//     serverError(
//       ModuleType.Mail,
//       ActionType.alertParse,
//       `uid:${uid} Subject:${subject}, error:${error.message}`
//     );
//   }
// };

// export const getDelay = (t1: number, t2: number) => {
//   const moment1 = moment.unix(t1);
//   const moment2 = moment.unix(t2);

//   return moment2.diff(moment1, "seconds");
// };

// const addMailListener = async (isRefresh?: boolean) => {
//   const email = process.env.EMAIL_ADDRESS;
//   const password = process.env.EMAIL_PASSWORD;
//   try {
//     if (!email || !password) {
//       throw new Error(`Invalid email or password`);
//     }

//     if (_MAIL_LISTENER_REFRESH_ATTEMPTS === 0) {
//       throw new Error("Mail listener failed to restart");
//     }

//     const mailListener = new MailListener({
//       ...options,
//       username: email,
//       password: password,
//     });

//     // Start
//     mailListener.start();

//     // Get errors
//     mailListener.on("error", onError);

//     mailListener.on("server:connected", () => {
//       mailListener.on("mail", (mail: any, seqno: any, attributes: any) => {
//         onMail(mail, seqno, attributes);
//       });

//       serverSuccess(ModuleType.Mail, isRefresh? ActionType.mailRefresh: ActionType.addMailListener);
//     });

//     return mailListener;

//     // Simple example of how to get all attachments from an email
//   } catch (error: any) {
//     serverError(
//       ModuleType.Mail,
//       ActionType.addMailListener,
//       `${error.message}`
//     );
//     process.exit(1);
//   }
// };

// export const mailListener=async()=>{
//   await addMailListener();

//   setInterval(()=> addMailListener(true), (1000 * 60 * 5));
// }


