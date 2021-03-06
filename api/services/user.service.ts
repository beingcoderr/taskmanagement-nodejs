import { Op } from "sequelize";
import { UserRole } from "../common/enums";
import { NotFoundException } from "../exceptions/exceptions";
import { UserInterface } from "../interfaces/user.interface";
import User from "../models/user.model";

/**
 * Get all users.
 *
 * @param options.skip cant be negative.
 * @param options.take can't be negative and greater than 25.
 */
export async function getAllUsers(options: { skip: number; take: number }) {
  const users = await User.findAndCountAll({
    attributes: ["id", "firstName", "lastName", "role", "phone"],

    offset: options.skip,
    limit: options.take,
  });
  return {
    count: users.count,
    users: users.rows,
  };
}

export async function getUserById(
  id: string,
  options?: {
    roles: UserRole[];
  }
) {
  let where = {};
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
        association: "manager",
        required: false,
        attributes: ["id", "firstName", "lastName", "role"],
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
    `user with id ${id} role ${options?.roles} was not found`
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
  const where = {
    phone,
    email,
  };

  const user = await User.findAll({ where });
  return user;
}

export async function getUserManagerByUserId(id: string) {
  const user = await User.findOne({
    include: [
      {
        association: "manager",
        as: "manager",
        attributes: ["id", "phone", "email", "firstName", "lastName"],
      },
    ],
    attributes: [],
    where: {
      id,
    },
  });
  console.log("manager", user?.manager);
  return user?.manager;
}
