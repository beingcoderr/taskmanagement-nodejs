import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
} from "sequelize";
import { UserRole } from "../common/enums";
import database from "../configs/database";
import Project from "./project.model";
import { Task } from "./task.model";

interface UserAttributes {
  id?: string | null;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  salt: string;
  role: UserRole;
}

export class User extends Model implements UserAttributes {
  declare id?: string;
  declare phone: string;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare salt: string;
  declare role: UserRole;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare addTask: HasManyAddAssociationMixin<Task, string>;
  declare setTask: HasManySetAssociationsMixin<Task, string>;
  declare readonly tasks: Task[];

  setManager: BelongsToSetAssociationMixin<User, string>;
  getManager: BelongsToGetAssociationMixin<User>;
  declare readonly manager: User;

  setOperatives: HasManyAddAssociationMixin<User, string>;
  getOperatives: HasManyGetAssociationsMixin<User>;
  declare readonly operatives: User[];

  addProject: HasManyAddAssociationMixin<Project, string>;
  declare readonly projects: Project[];

  declare static associations: {
    tasks: Association<User, Task>;
    manager: Association<User, User>;
    operatives: Association<User, User>;
    projects: Association<User, Project>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(UserRole),
      defaultValue: UserRole.USER,
    },
  },
  {
    sequelize: database,
    tableName: "user",
    modelName: "user",
  }
);
// const User = database.define(
//   "user",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },
//     phone: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true,
//       },
//     },
//     firstName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     lastName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     salt: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     role: {
//       type: DataTypes.ENUM,
//       allowNull: false,
//       values: Object.values(UserRole),
//       defaultValue: UserRole.USER,
//     },
//   },
//   {
//     tableName: "user",
//     modelName: "user",
//   }
// );

export default User;
