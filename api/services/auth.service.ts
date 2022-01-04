import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { sign } from "jsonwebtoken";
import { UserRole } from "../common/enums";
import { CreateUserDto } from "../dto/create-user.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { SignInDto } from "../dto/sign-in.dto";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../exceptions/exceptions";
import User from "../models/user.model";
import { getUserById, getUsersByPhoneOrEmail } from "./user.service";

export async function seedAdmins() {
  const adminInfo: CreateUserDto = {
    phone: "9664193686",
    email: "khatrifahad@gmail.com",
    firstName: "Fahad",
    lastName: "khatri",
    password: "password",
  };
  try {
    const user = await getUsersByPhoneOrEmail({
      email: adminInfo.email,
      phone: adminInfo.phone,
    });
    if (!user) {
      const salt = await bcrypt.genSalt();
      const generatedPassword = await bcrypt.hash(adminInfo.password, salt);
      await User.create({
        ...adminInfo,
        role: UserRole.ADMIN,
        salt,
        password: generatedPassword,
      });
    }
    console.log("Admins seeded successfully!");
  } catch (error) {
    console.log("Error on admin creation", error);
  }
}

/// isManager and isAdmin both can't be true
function assertCreateUser(options: {
  isManager: boolean;
  isAdmin: boolean;
}): asserts options {
  if (options.isManager && options.isAdmin) {
    throw Error("assertion error both isManager and isAdmin can't be true");
  }
}
export async function createUser(input: CreateUserDto) {
  const { phone, email, firstName, lastName, password, managerId } = input;
  const users = await getUsersByPhoneOrEmail({
    phone,
    email,
  });
  if (users) {
    throw new ConflictException("Phone or email already exists");
  }
  const salt = await bcrypt.genSalt();
  const generatedPassword = await bcrypt.hash(password, salt);
  const newUser = User.build(
    {
      phone,
      email,
      firstName,
      lastName,
      salt,
      password: generatedPassword,
    },
    {
      include: "manager",
    }
  );
  newUser.setDataValue("role", UserRole.MANAGER);
  if (managerId) {
    const manager = await getUserById(managerId, {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    });
    if (!manager) {
      throw new NotFoundException(`manager with ID ${managerId} was not found`);
    }
    newUser.setDataValue("manager", manager);
  }
  await newUser.save({ logging: true });
  const { id } = newUser.toJSON();
  const token = sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
}

export async function signIn(
  input: SignInDto,
  options?: {
    onlyAdmins: boolean;
  }
) {
  const { phone, password } = input;
  let where = {};
  where = {
    phone,
  };
  if (options?.onlyAdmins) {
    where = {
      ...where,
      role: UserRole.ADMIN,
    };
  } else {
    where = {
      ...where,
      role: [UserRole.MANAGER, UserRole.USER],
    };
  }
  const user = await User.findOne({
    where,
  });
  if (!user) {
    throw new UnauthorizedException();
  }
  const salt: string = user.getDataValue("salt");
  const providedHashedPassword = await bcrypt.hash(password, salt);
  const originalPassword: string = await user.getDataValue("password");
  if (providedHashedPassword === originalPassword) {
    const { id } = user.get();
    const payload = { id };
    const token: string = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  } else {
    throw new UnauthorizedException("invalid credentials");
  }
}

export async function resetPassword(
  id: string,
  input: ResetPasswordDto,
  currentUser?: any
) {
  if (!currentUser || currentUser.id !== id) {
    throw new UnauthorizedException("user Id mismatched");
  }

  const { currentPassword, newPassword } = input;
  const user = await User.findOne({
    where: { id },
  });
  const oldSalt = user.getDataValue("salt");
  const oldPass = user.getDataValue("password");
  console.log("Data and salt", `${currentPassword} ${oldSalt}`);
  const oldHashedPass = await bcrypt.hash(currentPassword, oldSalt);
  if (oldPass !== oldHashedPass) {
    throw new BadRequestException("current password is incorrect");
  }

  const newSalt = await bcrypt.genSalt();
  const password = await bcrypt.hash(newPassword, newSalt);
  user.setDataValue("salt", newSalt);
  user.setDataValue("password", password);

  await user.save();
  return true;
}