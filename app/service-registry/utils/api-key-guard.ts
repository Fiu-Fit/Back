import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  validateApiKey(apiKey: string): boolean {
    return apiKey === process.env.SERVICE_REGISTRY_API_KEY;
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['api-key'] ?? req.query.apiKey; // checks the header, moves to query if null
    return this.validateApiKey(key);
  }
}
