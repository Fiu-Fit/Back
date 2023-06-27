export interface Goal {
  id: number;
  title: string;
  description: string;
  userId: number;
  targetValue: number;
  deadline?: Date;
  createdAt?: Date;
  exerciseId: string;
  status: GoalStatus;
  multimedia: string[];
}

export enum GoalStatus {
  InProgress = 0,
  Completed = 1,
  CompletedLate = 2
}

export const goalStatusToString = (status: GoalStatus): string => {
  const translation = {
    [GoalStatus.InProgress]:    'En progreso',
    [GoalStatus.Completed]:     'Completada',
    [GoalStatus.CompletedLate]: 'Completada tarde'
  };

  return translation[status];
};
