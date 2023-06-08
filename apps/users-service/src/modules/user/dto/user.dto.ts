import { Role } from '@prisma/client';
import { Category } from 'common';

export interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  role: Role;
  bodyWeight: number;
  interests: Category[];
  coordinates: [number, number];
}
