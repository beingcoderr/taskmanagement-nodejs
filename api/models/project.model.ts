import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
} from "sequelize";
import database from "../configs/database";
import Task from "./task.model";
import User from "./user.model";

interface ProjectInterface {
  id?: string | null;
  name: string;
  description?: string | null;
  managerId?: string | null;
}

class Project extends Model<ProjectInterface> implements ProjectInterface {
  declare id?: string | null | undefined;
  declare name: string;
  declare description?: string | null | undefined;
  declare managerId?: string | null | undefined;

  setManager: HasOneSetAssociationMixin<User, string>;
  declare manager: User;

  addTask: HasManyAddAssociationMixin<Task, string>;
  declare readonly tasks: Task[];

  declare static associations: {
    manager: Association<Project, User>;
    tasks: Association<Project, Task>;
  };
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: database,
    tableName: "project",
    modelName: "project",
  }
);
// const Project = database.define(
//   "project",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "project",
//     modelName: "project",
//   }
// );

export default Project;
