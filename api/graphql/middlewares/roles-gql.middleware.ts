import { UserRole } from "../../common/enums";
import { getCurrentGqlUser } from "../../common/utils";
import { ForbiddenException } from "../../exceptions/exceptions";

export function checkGqlRoles(context: unknown, ...roles: UserRole[]) {
  const currentUser = getCurrentGqlUser(context);
  const isRolesSatisfied = roles.some(
    () => !!roles.find((role) => role === currentUser.role)
  );
  if (!isRolesSatisfied) {
    return new ForbiddenException();
  }
  return;
}
