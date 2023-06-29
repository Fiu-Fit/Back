export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  favoriteWorkouts: string[];
}

export enum Role {
  Athlete = 'Athlete',
  Trainer = 'Trainer',
  Admin = 'Admin'
}
