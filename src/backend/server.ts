import express from 'express';
// import session from "express-session";
import ExceptionHandler from './app/Exceptions/Handler';
import { routes } from './start/routes';
import cors from 'cors';

export function CreateServer() {
  const app = express();
  app.use(express.json({ limit: '1.5mb' }));
  app.use(ExceptionHandler);
  app.use(cors());
  // app.use(
  //     session({
  //         secret: "TokCards1234",
  //         resave: false,
  //         saveUninitialized: true,
  //         cookie: { 
  //           maxAge: 60000 * 60
  //         },
  //     })
  // );
  app.use(routes);
  app.use(express.static('/dist'));
  return app.listen();
}
