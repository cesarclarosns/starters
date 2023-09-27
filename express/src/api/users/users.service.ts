import { User } from "../../db/models/user.model";

class UsersService {
  async findAll() {
    const users = await User.find({}, { email: 1 });
    return users;
  }
}

export const usersService = new UsersService();
