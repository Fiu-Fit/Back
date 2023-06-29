export enum GoalStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  CompletedLate = 'CompletedLate'
}

export class Goal {
  id: number;

  title: string;

  description: string;

  userId: number;

  targetValue: number;

  deadline: Date | null;

  createdAt: Date;

  exerciseId: string;

  status: GoalStatus;
}
