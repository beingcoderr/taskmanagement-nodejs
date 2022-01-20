import {
  Association,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
} from "sequelize";
import { TaskStatus } from "../common/enums";
import database from "../configs/database";
import Project from "./project.model";
import { User } from "./user.model";

interface TaskInterface {
  id?: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  completedAt?: Date | null;
  userId?: string | null;
  projectId?: string | null;
}

export class Task extends Model<TaskInterface> implements TaskInterface {
  declare id?: string;
  declare title: string;
  declare description: string;
  declare status: TaskStatus;
  declare completedAt?: Date | null | undefined;
  declare userId?: string | null;
  declare projectId?: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  setUser: BelongsToSetAssociationMixin<User, string>;
  declare readonly user: User;
  setProject: BelongsToSetAssociationMixin<Project, string>;
  declare readonly project: Project;

  declare static associations: {
    user: Association<Task, User>;
    project: Association<Task, Project>;
  };
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(TaskStatus),
      defaultValue: TaskStatus.OPEN,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
    },
  },
  {
    sequelize: database,
    tableName: "tasks",
    modelName: "tasks",
  }
);
// const Task = database.define(
//   "tasks",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },

//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM,
//       values: Object.values(TaskStatus),
//       defaultValue: TaskStatus.OPEN,
//       allowNull: false,
//     },
//     completedAt: {
//       type: DataTypes.DATE,
//       defaultValue: null,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "tasks",
//     modelName: "tasks",
//   }
// );

export default Task;
