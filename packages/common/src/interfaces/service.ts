export interface Service {
  id: number;
  apiKey: string;
  name: string;
  url: string;
  description: string;
  status: ServiceStatus;
}

export enum ServiceStatus {
  Available = 'Available',
  Blocked = 'Blocked'
}
