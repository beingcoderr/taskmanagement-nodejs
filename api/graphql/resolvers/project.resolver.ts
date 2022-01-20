import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLString,
  ThunkObjMap,
} from "graphql";
import graphqlFields from "graphql-fields";
import { UserRole } from "../../common/enums";
import { getCurrentGqlUser } from "../../common/utils";
import { CreateProjectDto } from "../../dto/create-project.dto";
import { BadRequestException } from "../../exceptions/exceptions";
import {
  createProject,
  getAllProjects,
  getProjectById,
} from "../../services/project.service";
import {
  CreateProjectArgument,
  SkipTakeArgument,
} from "../arguments/gql-arguments";
import { checkGqlRoles } from "../middlewares/roles-gql.middleware";
import { ProjectsType, ProjectType } from "../types/project.type";
import {
  createProjectValidator,
  idValidator,
  skipTakeValidator,
} from "../validators/gql-validators";

const projectQueryResolver: ThunkObjMap<GraphQLFieldConfig<unknown, unknown>> =
  {
    getAllProjects: {
      type: ProjectsType,
      args: SkipTakeArgument,
      resolve: async (source, args, context) => {
        const currentUser = getCurrentGqlUser(context);
        try {
          await skipTakeValidator.validate(args.options, { abortEarly: false });
          const { skip, take } = args.options;
          const projects = await getAllProjects({ skip, take, currentUser });
          return projects;
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },

    getProjectById: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, args, context, info) => {
        const fields = graphqlFields(info);
        getCurrentGqlUser(context);
        try {
          await idValidator.validate(args.id);
          const id = args.id;
          const getManager = !!fields.manager;
          const project = await getProjectById(id, { getManager });
          return project;
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new BadRequestException(error.errors);
          }
          throw error;
        }
      },
    },
  };

const projectMutationResolver: ThunkObjMap<
  GraphQLFieldConfig<unknown, unknown>
> = {
  createProject: {
    type: ProjectType,
    args: CreateProjectArgument,
    resolve: async (source, args, context) => {
      const currentUser = getCurrentGqlUser(context);
      checkGqlRoles(context, UserRole.ADMIN, UserRole.MANAGER);
      try {
        await createProjectValidator.validate(args.input);
        const input: CreateProjectDto = args.input;
        const newProject = await createProject(input, currentUser);
        return newProject;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new BadRequestException(error.errors);
        }
        throw error;
      }
    },
  },
};
export { projectMutationResolver, projectQueryResolver };
