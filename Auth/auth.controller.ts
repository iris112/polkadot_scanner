import { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service";
import jwt from "jsonwebtoken";
import debug, { IDebugger } from "debug";
import { Password } from "../Common/services/password";
const jwtSecret: string = process.env.JWT_SECRET || "123456";
const tokenExpirationInSeconds = 36000;

const log: IDebugger = debug("auth:controller");

class AuthController {
  constructor() {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await AuthService.findUserByEmail(email);
      log("user", user);
      if (user) {
        const isPasswordMatch = await Password.compare(user.password, password);

        if (!isPasswordMatch) {
          return res
            .status(403)
            .send({ success: false, message: "Invalid Password" });
        } else {
          log("jwt Secret", jwtSecret);
          const token = jwt.sign(req.body, jwtSecret, {
            expiresIn: tokenExpirationInSeconds,
          });

          return res.status(200).json({
            success: true,
            data: user,
            token,
          });
        }
      } else {
        log("User Not Found");
        return res
          .status(403)
          .send({ success: false, message: "User not found" });
      }
    } catch (e) {
      next(e);
    }
  }
  
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;

      if (!username || !email || !password)
        return res
          .status(403)
          .send({ success: false, message: "Username, Email, Password are required" });

      const user = await AuthService.findUserByEmail(email);
      log("user", user);
      if (user) {
        return res
          .status(403)
          .send({ success: false, message: "User Already Exist" });
      } else {
        try {
          const newUser = await AuthService.createUser({
            username,
            email,
            password,
          });

          const token = jwt.sign({ username, password }, jwtSecret, {
            expiresIn: tokenExpirationInSeconds,
          });

          return res.status(200).json({
            success: true,
            data: newUser,
            token,
          });
        } catch (e) {
          log("Controller capturing error", e);
          return res
          .status(403)
          .send({ success: false, message: "Error while register" });
        }
      }
    } catch (e) {
      next(e);
    }
  }

  loginForm(req: Request, res: Response, next: NextFunction) {
    res.sendFile('login.html', { root : __dirname });
  }

  signupForm(req: Request, res: Response, next: NextFunction) {
    res.sendFile('signup.html', { root : __dirname });
  }
}

export default new AuthController();