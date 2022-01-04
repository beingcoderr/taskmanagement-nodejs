import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import createAssociates from "./api/configs/create-associate";
import { NotFoundException } from "./api/exceptions/exceptions";
import { jwtMiddleware } from "./api/middlewares/jwt.middleware";
import authRouter from "./api/routes/auth.route";
import userRouter from "./api/routes/user.route";
import { seedAdmins } from "./api/services/auth.service";

createAssociates();

seedAdmins();

const app = express();
app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

app.use("/user", jwtMiddleware, userRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  throw new NotFoundException();
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message,
  });
});

export default app;
