import Project from "../models/project.model";
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

  // Project belongs to a manager
  Project.belongsTo(User, { as: "manager", foreignKey: "managerId" });
  // manager has many projects
  User.hasMany(Project, { as: "projects", foreignKey: "managerId" });

  //Project has many tasks
  Project.hasMany(Task, { as: "tasks" });
  // Task belongs to a project
  Task.belongsTo(Project, { as: "project" });

  console.log("Associates created!");
};

export default createAssociates;
