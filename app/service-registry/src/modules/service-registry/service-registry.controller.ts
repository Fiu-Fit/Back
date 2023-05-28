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
import { Service } from '@prisma/client';
import { ServiceRegistryDto } from './dto/service-registry.dto';
import { ServiceRegistryService } from './service-registry.service';

@Injectable()
@Controller('service-registry')
export class ServiceRegistryController {
  constructor(private serviceRegistryService: ServiceRegistryService) {}

  @Get()
  getServices(): Promise<Service[]> {
    return this.serviceRegistryService.findAll();
  }

  @Get(':id')
  getServiceById(@Param('id') id: number): Promise<Service | null> {
    return this.serviceRegistryService.findById(id);
  }

  @Post()
  createService(@Body() service: ServiceRegistryDto): Promise<Service> {
    return this.serviceRegistryService.createService(service);
  }

  @Put(':id')
  editService(
    @Param('id') id: number,
    @Body() service: ServiceRegistryDto
  ): Promise<Service> {
    return this.serviceRegistryService.editService(id, service);
  }

  @Delete(':id')
  deleteService(@Param('id') id: number): Promise<Service> {
    return this.serviceRegistryService.deleteService(id);
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
