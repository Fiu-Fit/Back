export enum Category {
  LEGS = 0,
  CHEST = 1,
  BACK = 2,
  SHOULDERS = 3,
  ARMS = 4,
  CORE = 5,
  CARDIO = 6,
  FULLBODY = 7,
  FREEWEIGHT = 8,
  STRETCHING = 9,
  STRENGTH = 10,
  UNRECOGNIZED = -1
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  unit: Unit; // for reps
  repDuration: number;
}

export enum Unit {
  KILOGRAMS,
  METERS,
  SECONDS,
  REPETITIONS
}

export class Workout {
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

  multimedia: string[];
}
