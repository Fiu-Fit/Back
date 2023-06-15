import { Category } from './category';
import { WorkoutExercise } from './workoutExercise';

export interface Workout {
  _id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: number;
  category: Category;
  exercises: WorkoutExercise[];
  athleteIds: number[];
  authorId: number;
  averageRating?: number;
  updatedAt?: string;
}
