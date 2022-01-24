import { GraphQLBoolean, GraphQLFieldConfig, ThunkObjMap } from "graphql";
import { UserRole } from "../../common/enums";
import { getCurrentGqlUser } from "../../common/utils";
import { CreateUserDto } from "../../dto/create-user.dto";
import { ResetPasswordDto } from "../../dto/reset-password.dto";
import { SignInDto } from "../../dto/sign-in.dto";
import {
  BadRequestException,
  ForbiddenException,
  InternalServerException,
  UnauthorizedException,
} from "../../exceptions/exceptions";
import { createUser, resetPassword, signIn } from "../../services/auth.service";
import {
  CreateUserArgument,
  ResetPasswordArguments,
  SignInArguments,
} from "../arguments/gql-arguments";
import { checkGqlRoles } from "../middlewares/roles-gql.middleware";
import AuthTokenType from "../types/auth-token.type";
import { NewUserType } from "../types/common.type";
import {
  createUserValidator,
  resetPasswordValidator,
  signInValidator,
} from "../validators/gql-validators";

/**
 * Auth resolver mutations containing
 * signIn
 * signInAdmin
 * resetPassword
 * createManager
 * createUser
 */
const autMutationshResolver: ThunkObjMap<GraphQLFieldConfig<unknown, unknown>> =
  {
    signIn: {
      type: AuthTokenType,
      args: SignInArguments,
      resolve: async (source, args) => {
        try {
          await signInValidator.validate(args.input, { abortEarly: true });
          const input: SignInDto = args.input;
          return await signIn(input);
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },

    signInAdmin: {
      type: AuthTokenType,
      args: SignInArguments,
      resolve: async (source, args) => {
        try {
          await signInValidator.validate(args.input, { abortEarly: true });
          const input: SignInDto = args.input;
          return await signIn(input, { onlyAdmins: true });
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },

    resetPassword: {
      type: GraphQLBoolean,
      args: ResetPasswordArguments,
      resolve: async (source, args, context) => {
        const entries = Object(context);
        if (!entries.isAuth) {
          throw new UnauthorizedException();
        }
        try {
          await resetPasswordValidator.validate(args, {
            abortEarly: true,
          });
          const id: string = args.id;
          const input: ResetPasswordDto = args.input;
          const currentUser = getCurrentGqlUser(context);
          const passwordReset = await resetPassword(id, input, currentUser);
          if (passwordReset) {
            return true;
          }
          return false;
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },

    createManager: {
      type: NewUserType,
      args: CreateUserArgument,
      resolve: async (source, args, context) => {
        const currentUser = getCurrentGqlUser(context);
        checkGqlRoles(context, UserRole.ADMIN);
        try {
          await createUserValidator.validate(args.input);
          const input: CreateUserDto = args.input;
          // Manager cannot create operatives under other managers
          if (
            currentUser.role !== UserRole.ADMIN &&
            input.managerId !== currentUser.id
          ) {
            throw new ForbiddenException("managerId mismatch");
          }

          const newUser = await createUser(input, {
            createManager: true,
            createUser: false,
          });
          if (newUser) {
            return newUser;
          } else {
            throw new InternalServerException("something went wrong");
          }
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },

    createUser: {
      type: NewUserType,
      args: CreateUserArgument,
      resolve: async (source, args, context) => {
        const currentUser = getCurrentGqlUser(context);
        checkGqlRoles(context, UserRole.ADMIN, UserRole.MANAGER);
        try {
          await createUserValidator.validate(args.input);
          const input: CreateUserDto = args.input;
          // Manager cannot create operatives under other managers
          if (
            currentUser.role !== UserRole.ADMIN &&
            input.managerId !== currentUser.id
          ) {
            throw new ForbiddenException("managerId mismatch");
          }

          const newUser = await createUser(input, {
            createManager: false,
            createUser: true,
          });
          if (newUser) {
            return newUser;
          } else {
            throw new InternalServerException("something went wrong");
          }
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },
  };

export default autMutationshResolver;
