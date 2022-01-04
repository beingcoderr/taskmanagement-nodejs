import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app";

// configure environment variables defined in .env file
dotenv.config();

const port = process.env.PORT || 3000;

const server = createServer(app);
server.listen(port, () => console.log(`Listening on port: ${port}`));
