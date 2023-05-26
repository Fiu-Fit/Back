import { Category } from '@fiu-fit/common';
import { Role } from '@prisma/client';

export type UserRoles = keyof typeof Role;

export interface UserId {
  id: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  favoriteWorkouts: string[];
  interests: Category[];
}

export interface Empty {}

export interface UserPages {
  rows: User[];
  count: number;
}
