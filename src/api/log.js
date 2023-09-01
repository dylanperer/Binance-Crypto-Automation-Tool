"use strict";
// import { expressApp } from ".";
// import { prisma } from "../../prisma/prisma";
// import { Session, Log } from "@prisma/client";
// import { ActionType, ModuleType, serverError } from "../logger";
// const route = "log";
// //live session's logs
// export const liveSessionLogs = (expressApp:any) => {
//   expressApp.get(`/${route}/live`, async (req: any, res: any) => {
//     try {
//       const liveSession = await prisma.session.findFirst({
//         where: { hasEnded: "false" },
//       });
//       const logs = await prisma.log.findMany({
//         where: { sessionId: liveSession?.id },
//       });
//       res.status(200).send({ session: liveSession, logs: logs });
//     } catch (error: any) {
//       serverError(ModuleType.Api, ActionType.apiEndpoint, `/${route}/live`);
//     }
//   });
// };
// //archived logs
// export const archivedLogs = (expressApp: any) => {
//   expressApp.get(`/${route}/archive`, async (req: any, res: any) => {
//     try {
//       const archivedSessions = await prisma.session.findMany({
//         where: { hasEnded: "true" },
//       });
//       const sessions: Array<{ session: Session; logs: Array<Log> }> = [];
//       // Use map to create an array of promises
//       const sessionPromises = archivedSessions.map(async (c) => {
//         const session: { session: Session; logs: Array<Log> } = {
//           session: c,
//           logs: [],
//         };
//         const sessionLogs = await prisma.log.findMany({
//           where: { sessionId: c.id },
//         });
//         sessionLogs.map((u) => {
//           session.logs.push(u);
//         });
//         return session;
//       });
//       // Use Promise.all to wait for all promises to resolve
//       const resolvedSessions = await Promise.all(sessionPromises);
//       // Add the resolved sessions to the response
//       resolvedSessions.forEach((session) => {
//         sessions.push(session);
//       });
//       res.status(200).send(sessions);
//     } catch (error) {
//       serverError(ModuleType.Api, ActionType.apiEndpoint, `/${route}/archive`);
//     }
//   });
// };
