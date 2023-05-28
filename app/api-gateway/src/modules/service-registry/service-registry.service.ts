import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';

@Injectable()
export class ServiceRegistryService {
  constructor(private httpService: HttpService) {}

  async getServiceByName(name: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/service-registry/name/${name}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
