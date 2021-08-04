import { Response, NextFunction } from "express";
import UserService from "./user.service";
class UserController {
  constructor() {}

  async getUser(req: any, res: Response, next: NextFunction) {
    const email = req.user.email;
    try {
      const user = await UserService.findUserByEmail(email);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  getHome(req:any, res:Response, next:NextFunction) {
    return res.sendFile(process.cwd() + "/web-app/build/index.html");
  }
}

export default new UserController();