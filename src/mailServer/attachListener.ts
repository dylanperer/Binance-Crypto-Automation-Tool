// //@ts-ignore
// import { MailListener } from "mail-listener5";
// //@ts-ignore
// import options from "./settings.json";
// import { ActionType, ModuleType, serverError, serverInfo, serverSuccess } from "../logger";
// import { onMail } from "./mailParser";

// let MAIL_LISTENER_REFRESH_ATTEMPTS = 2;

// const onError = async (error: any) => {
//   serverError(
//     ModuleType.Mail,
//     ActionType.mailError,
//     `${error.toString()}, ${error.message}`
//   );

//   serverInfo(
//     ModuleType.Mail,
//     ActionType.mailRestart,
//     `restarting, attempts remaining ${MAIL_LISTENER_REFRESH_ATTEMPTS}...`
//   );

//   MAIL_LISTENER_REFRESH_ATTEMPTS -= 1;

//   attachListener();
// };

// const attachListener = async (isRefresh?: boolean) => {
//   const email = process.env.EMAIL_ADDRESS;
//   const password = process.env.EMAIL_PASSWORD;

//   try {
//     if (!email || !password) {
//       throw new Error(`Invalid email or password`);
//     }

//     if (MAIL_LISTENER_REFRESH_ATTEMPTS === 0) {
//       throw new Error("Restart...");
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

//       serverSuccess(
//         ModuleType.Mail,
//         isRefresh ? ActionType.mailRefresh : ActionType.addMailListener
//       );
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

// export const startMailListener = async (refreshFrequencyInMinutes: number) => {
//   await attachListener();

//   setInterval(
//     () => attachListener(true),
//     1000 * 60 * refreshFrequencyInMinutes
//   );
// };
