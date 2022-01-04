import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();
const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    logging: false,
    host: process.env.DB_HOST,
    dialect: "postgres" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    port: Number.parseInt(process.env.DB_PORT),
  }
);

database
  .authenticate()
  .then(() => {
    console.log("Database connected");
    database.sync();
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

export default database;
