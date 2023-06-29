import { Category } from '../../workout/dto/workout.dto';

export class User {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  role: string;

  favoriteWorkouts: string[];

  interests: Category[];

  coordinates: number[];
}
