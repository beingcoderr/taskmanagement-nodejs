import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import * as swagger from "swagger-ui-express";
import YAML from "yamljs";
import createAssociates from "./api/configs/create-associate";
import { NotFoundException } from "./api/exceptions/exceptions";
import { graphqlServer, playground } from "./api/graphql/graphql-main";
import { jwtGqlMiddleware } from "./api/graphql/middlewares/jwt-gql.middleware";
import { jwtMiddleware } from "./api/middlewares/jwt.middleware";
import authRouter from "./api/routes/auth.route";
import projectRouter from "./api/routes/project.route";
import taskRouter from "./api/routes/task.route";
import userRouter from "./api/routes/user.route";
import { seedAdmins } from "./api/services/auth.service";

const swaggerDocument = YAML.load("./swagger.yaml");
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
app.use(compression());

// End points
// Swagger
app.use(
  "/api",
  swagger.serve,
  swagger.setup(swaggerDocument, { explorer: true })
);
app.use("/user", jwtMiddleware, userRouter);
app.use("/auth", authRouter);
app.use("/project", jwtMiddleware, projectRouter);
app.use("/task", jwtMiddleware, taskRouter);

app.use(jwtGqlMiddleware);
app.use("/graphql", graphqlServer);

app.use("/playground", playground);
// Handling if request is sent to none of the routes defined
app.use(() => {
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
