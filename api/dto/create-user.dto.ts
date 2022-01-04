export interface CreateUserDto {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  managerId?: string;
}
