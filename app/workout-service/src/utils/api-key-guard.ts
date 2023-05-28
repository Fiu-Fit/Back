import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private httpService: HttpService) {}

  async validateApiKey(apiKey: string): Promise<boolean> {
    const { data } = await firstValueFrom(
      this.httpService.get<boolean>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/verify-api-key/${apiKey}`
      )
    );

    return data;
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const key = req.headers['api-key'] ?? req.query.apiKey; // checks the header, moves to query if null

    if (!key) {
      return Promise.resolve(false);
    }

    return this.validateApiKey(key);
  }
}
