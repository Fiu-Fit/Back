export enum Role {
  Admin = 0,
  Athlete = 1,
  Trainer = 2,
  UNRECOGNIZED = -1
}

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
}

export interface Empty {}

export interface UserPages {
  rows: User[];
  count: number;
}
