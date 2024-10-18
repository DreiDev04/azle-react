// import cors from 'cors';
import express from 'express';
import session from "express-session";
import ExceptionHandler from './app/Exceptions/Handler';
import { routes } from './start/routes';

export function CreateServer() {
  const app = express();
  app.use(express.json({ limit: '1.5mb' }));
  app.use(ExceptionHandler);
  // app.use(express.urlencoded({ extended: true }));
  // app.use(
  //     session({
  //         secret: "TokCards1234",
  //         resave: false,
  //         saveUninitialized: false,
  //     })
  // );
  app.use(routes);
  app.use(express.static('/dist'));
  return app.listen();
}
