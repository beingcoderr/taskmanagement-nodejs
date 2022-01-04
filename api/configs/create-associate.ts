import Task from "../models/task.model";
import User from "../models/user.model";

const createAssociates = () => {
  // Create User and Tasks associates
  Task.belongsTo(User, { as: "user" });
  User.hasMany(Task, { as: "tasks" });

  // Users (operatives) has one manager
  User.belongsTo(User, {
    as: "manager",
    foreignKey: "managerId",
  });
  User.hasMany(User, {
    as: "operatives",
    foreignKey: "managerId",
  });

  console.log("Associates created!");
};

export default createAssociates;
