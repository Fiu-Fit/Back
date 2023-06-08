export interface Rating {
  workoutId: string;
  athleteId: number;
  rating: number;
  comment?: string;
  ratedAt: Date;
}
