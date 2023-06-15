export interface Rating {
  _id: string;
  workoutId: string;
  athleteId: number;
  rating: number;
  comment?: string;
  ratedAt: Date;
}
