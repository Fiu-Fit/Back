import { Category } from '../../workout/interfaces/workout.interface';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: Category;
  METValue: number;
}
