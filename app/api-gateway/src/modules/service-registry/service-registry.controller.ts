import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { Service } from '../../shared/service-config';
import { ServiceRegistryDto } from './dto';
import { ServiceRegistryService } from './service-registry.service';

@Injectable()
@Controller('service-registry')
export class ServiceRegistryController {
  private readonly entityName: string = 'service-registry';

  constructor(
    private httpService: HttpService,
    private serviceRegistryService: ServiceRegistryService
  ) {}

  @Post()
  public async createService(@Body() service: ServiceRegistryDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, service)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async getServices() {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async getServiceById(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteService(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async editService(
    @Param('id') id: number,
    @Body() service: ServiceRegistryDto
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, service)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get('name/:name')
  getServiceByName(@Param('name') name: string): Promise<Service> {
    return this.serviceRegistryService.getServiceByName(name);
  }

  @Get('verify-api-key/:apikey')
  verifyApiKey(@Param('apikey') apiKey: string): Promise<boolean> {
    return this.serviceRegistryService.verifyApiKey(apiKey);
  }
}
