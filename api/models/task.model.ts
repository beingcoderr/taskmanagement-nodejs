import { DataTypes } from "sequelize";
import { TaskStatus } from "../common/enums";
import database from "../configs/database";

const Task = database.define(
  "tasks",
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
      values: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
      defaultValue: TaskStatus.OPEN,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
    modelName: "tasks",
  }
);

export default Task;
