import { RatingCount } from './ratingCount';

export interface WorkoutMetric {
  favoriteCount: number;
  averageRating: number;
  ratings: RatingCount[];
}
