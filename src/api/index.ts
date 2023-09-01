// import express from "express";
// import { serverSuccess, serverError, serverInfo } from '../logger';
// import { archivedLogs, liveSessionLogs } from './log';

// import {
//   ModuleType,
//   ActionType,
// } from "../logger";

// export const expressApp = express();

// expressApp.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });

// expressApp.get("/", async (req, res) => {
//   try {
//     res.status(200).send("live")
//   } catch (error) {
//     serverError(ModuleType.Api, ActionType.apiEndpoint, '/');
//   }
// });

// export const startExpress = () => {
//   const port = process.env.PORT;

//   expressApp.listen(port, () => {
//     serverSuccess(ModuleType.Api, ActionType.apiStarted, `Port:${port}`);
//   });
// };


// archivedLogs(expressApp);
// liveSessionLogs(expressApp);
