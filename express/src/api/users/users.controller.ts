import { RequestHandler, Router } from "express";
import { usersService } from "./users.service";

class UsersController {
  router = Router();

  constructor() {
    this.router.get("/", this.findAll());
  }

  findAll(): RequestHandler {
    return async (req, res) => {
      const users = await usersService.findAll();
      res.send(users);
    };
  }
}

export const usersController = new UsersController();
