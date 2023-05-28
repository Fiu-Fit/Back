import { generateApiKey } from 'generate-api-key';

export const ServiceName = {
  Workout:  'workout',
  User:     'user',
  Progress: 'progress'
};

export function generateKey(): string {
  return generateApiKey() as string;
}
