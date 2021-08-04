import express, { Express } from "express";
import * as http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import debug, { IDebugger } from "debug";
import dotenv from "dotenv";
dotenv.config({});
import { RouteConfig } from "./Common/common.route.config";
import { UserRoutes } from "./User/user.route.config";
import { AuthRoutes } from "./Auth/auth.route.config";
import JWT from "./Common/middlewares/JWT";
const app: Express = express();
const routes: Array<RouteConfig> = [];

import { IUser } from "./User/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(cookieParser());
app.use(JWT.authenticateJWTExcept("/login", "/signup"));
app.use(express.static(process.cwd() + "/web-app/build/"));

const PORT = process.env.PORT || 8000;
const debugLog: IDebugger = debug("app");

if (process.env.DEBUG) {
  process.on("unhandledRejection", function (reason) {
    debugLog("Unhandled Rejection:", reason);
    process.exit(1);
  });
} else {
}
routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));

const server: http.Server = http.createServer(app);
server.listen(PORT, () => {
  debugLog(`Server is running on ${PORT}`);

  routes.forEach((route: RouteConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
});