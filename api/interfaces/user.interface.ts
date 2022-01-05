import { UserRole } from "../common/enums";

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CurrentUser {
  id: string;
  role: UserRole;
}
