import { Op } from "sequelize";
import { UserRole } from "../common/enums";
import { NotFoundException } from "../exceptions/exceptions";
import { UserInterface } from "../interfaces/user.interface";
import User from "../models/user.model";

export async function getAllUsers() {
  console.log("Here");
  const users = await User.findAll({
    attributes: ["id", "firstName", "lastName", "role", "phone"],
  });
  return users;
}

export async function getUserById(
  id: string,
  options?: {
    roles: UserRole[];
  }
) {
  var where = {};
  where = {
    id,
  };

  if (options?.roles) {
    where = {
      ...where,
      role: options.roles,
    };
  }
  const user = await User.findOne({
    logging: true,
    nest: true,
    where: where,
    include: [
      {
        association: "tasks",
        required: false,
      },
      {
        association: "operatives",
        required: false,
        attributes: ["id", "firstName", "lastName", "role"],
        // where: {
        //   id: {
        //     [Op.not]: id,
        //   },
        // },
      },
    ],
    attributes: ["id", "firstName", "lastName", "role"],
  });
  if (user) {
    const { id }: UserInterface = user.toJSON();
    console.log(id);
    return user;
  }
  throw new NotFoundException(
    `user with id ${id} role ${options.roles} was not found`
  );
}

export async function getUsersByPhoneOrEmail(options: {
  phone?: string;
  email?: string;
}) {
  const { phone, email } = options;
  let where = {};
  if (phone) {
    where = {
      ...where,
      [Op.or]: {
        phone,
      },
    };
  }
  if (email) {
    if (where[Op.or]) {
      where[Op.or] = {
        ...where[Op.or],
        email,
      };
    } else {
      where = {
        ...where,
        [Op.or]: {
          email,
        },
      };
    }
  }
  const user = await User.findOne({ where });
  return user;
}

export async function getUsersByPhoneAndEmail(options: {
  phone: string;
  email: string;
}) {
  const { phone, email } = options;
  let where = {
    phone,
    email,
  };

  const user = await User.findAll({ where });
  return user;
}
