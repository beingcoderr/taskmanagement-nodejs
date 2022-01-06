import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createAssociates from "./api/configs/create-associate";
import { NotFoundException } from "./api/exceptions/exceptions";
import { jwtMiddleware } from "./api/middlewares/jwt.middleware";
import authRouter from "./api/routes/auth.route";
import projectRouter from "./api/routes/project.router";
import taskRouter from "./api/routes/task.router";
import userRouter from "./api/routes/user.route";
import { seedAdmins } from "./api/services/auth.service";

// Create database relations
createAssociates();

// Initiate admin
seedAdmins();

const app = express();
app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Use body parser to access body params in a request
app.use(bodyParser.json());

// End points
app.use("/user", jwtMiddleware, userRouter);
app.use("/auth", authRouter);
app.use("/project", jwtMiddleware, projectRouter);
app.use("/task", jwtMiddleware, taskRouter);

// Handling if request is sent to none of the routes defined
app.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundException();
});

// Sending appropriate error response
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message,
  });
});

export default app;
