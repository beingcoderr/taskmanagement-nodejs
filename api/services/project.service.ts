import { Includeable, WhereOptions } from "sequelize/dist";
import { UserRole } from "../common/enums";
import { CreateProjectDto } from "../dto/create-project.dto";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../exceptions/exceptions";
import { CurrentUser } from "../interfaces/user.interface";
import Project from "../models/project.model";
import User from "../models/user.model";

/**
 * Get all projects.
 *
 * Admins will get all projects.
 * Managers will get projects they are assigned to.
 * Users will get projects that they have task within it.
 * @param options.skip cant be negative.
 * @param options.take can't be negative and greater than 25.
 */
export async function getAllProjects(options: {
  skip: number;
  take: number;
  currentUser: CurrentUser;
}) {
  const { skip, take, currentUser } = options;
  const { id, role } = currentUser;
  const include: Includeable[] = [];
  let where: WhereOptions = {};
  switch (role) {
    case UserRole.MANAGER:
      where = {
        ...where,
        managerId: id,
      };
      break;
    case UserRole.USER:
      include.push({
        association: "tasks",
        as: "tasks",
        attributes: [],
        required: false,
        where: {
          userId: id,
        },
      });
      break;
    default:
      break;
  }
  const projects = await Project.findAndCountAll({
    where,
    include,
    offset: skip,
    limit: take,
    attributes: ["id", "name", "description"],
  });
  return {
    count: projects.count,
    projects: projects.rows,
  };
}

/**
Returns project by id and it's manager
*/
export async function getProjectById(
  id: string,
  options?: { getManager: boolean }
) {
  const include: Includeable[] = [];
  if (options?.getManager) {
    include.push({
      association: "manager",
      as: "manager",
      attributes: ["id", "firstName", "lastName", "phone", "email"],
    });
  }
  const project = await Project.findByPk(id, {
    include,
    attributes: ["id", "name", "description", "createdAt", "updatedAt"],
  });
  if (project) {
    return project;
  }
  throw new NotFoundException(`project with ${id} was not found`);
}

/**
 * Create a project.
 * Admin can create proejct for another manager
 * Manager cannot create project for another manager
 */
export async function createProject(
  input: CreateProjectDto,
  currentUser: CurrentUser
) {
  const { name, description, managerId } = input;
  const { id, role } = currentUser;
  if (role !== UserRole.ADMIN && managerId !== id) {
    throw new UnauthorizedException(
      "manager cannot create project for another manager"
    );
  }
  const manager = await User.findByPk(managerId, {
    attributes: ["id", "firstName", "lastName"],
  });
  if (!manager) {
    throw new NotFoundException(`manager with id ${managerId} was not found`);
  }
  try {
    const newProject = await Project.create({
      name,
      description,
      managerId,
    });
    // await newProject.setManager(manager.id);
    const newProjectJson = newProject.toJSON();
    newProjectJson["manager"] = manager;
    return newProjectJson;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new ConflictException(error.errors);
    }
    throw error;
  }
}
