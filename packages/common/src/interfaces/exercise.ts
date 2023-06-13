import { Category } from './category';

export interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: Category;
  METValue: number;
}
