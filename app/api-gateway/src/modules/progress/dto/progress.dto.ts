import { Unit } from '@fiu-fit/common';

export type ProgressMetric = {
  id: number;
  burntCalories: number;
  timeSpent: number;
  value: number;
  unit: Unit;
  exerciseId: string;
  userId: number;
  updatedAt: Date;
};
