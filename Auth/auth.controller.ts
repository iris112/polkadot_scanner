import { NextFunction, Request, Response } from "express";
import UserService from "../Common/services/user";
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
      
      const user = await UserService.findUserByEmail(email);
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

          return res.cookie("token", token, { secure: true, httpOnly: true}).redirect("/");
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

      const user = await UserService.findUserByEmail(email);
      log("user", user);
      if (user) {
        return res
          .status(403)
          .send({ success: false, message: "User Already Exist" });
      } else {
        try {
          const newUser = await UserService.createUser({
            username,
            email,
            password,
          });

          const token = jwt.sign({ username, password }, jwtSecret, {
            expiresIn: tokenExpirationInSeconds,
          });
          
          res.cookie("token", token, {
            secure: true,
            httpOnly: true
          });

          return res.cookie("token", token, { secure: true, httpOnly: true}).redirect("/");
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