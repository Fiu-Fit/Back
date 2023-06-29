export enum RequestStatus {
  Pending = 'Pending',
  Declined = 'Declined',
  Approved = 'Approved'
}
export class Verification {
  id: number;

  userId: number;

  status: RequestStatus;

  resourceId: string;

  receivedAt: Date;
}
