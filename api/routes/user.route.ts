import express from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { getAllUsers, getUserById } from "../services/user.service";
const userRouter = express.Router();

userRouter.get("/", jwtMiddleware, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
    return;
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", jwtMiddleware, async (req, res, next) => {
  try {
    const user = await getUserById(req.params["id"]);
    res.status(200).json(user);
    return;
  } catch (error) {
    next(error);
  }
});

export default userRouter;
