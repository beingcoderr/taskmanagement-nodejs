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
    tableName: "tasks",
    modelName: "tasks",
  }
);

export default Task;
