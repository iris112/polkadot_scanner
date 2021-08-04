import User from "../User/user.model";
class UserService {
  async findUserByEmail(email: string) {
    return User.findOne({
      email: email,
    }).exec();
  }
}

export default new UserService();