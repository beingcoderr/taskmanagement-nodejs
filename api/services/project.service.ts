import { Includeable, WhereOptions } from "sequelize/dist";
import { UserRole } from "../common/enums";
import { CurrentUserInterface } from "../interfaces/user.interface";
import Project from "../models/project.model";

export async function getAllProjects(options: {
  skip: number;
  take: number;
  currentUser: CurrentUserInterface;
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
    logging: console.log,
    attributes: ["id", "name", "description"],
  });
  return {
    count: projects.count,
    projects: projects.rows,
  };
}
