import { Role } from '@prisma/client';

export interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  role: Role;
  bodyWeight: number;
}
