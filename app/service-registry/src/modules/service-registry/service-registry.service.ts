import { BadRequestException, Injectable } from '@nestjs/common';
import { Service, ServiceStatus } from '@prisma/client';
import { generateKey } from '../../../shared/services';
import { PrismaService } from '../../prisma.service';
import { ServiceRegistryDto } from './dto/service-registry.dto';

@Injectable()
export class ServiceRegistryService {
  constructor(private prismaService: PrismaService) {}

  findAll(): Promise<Service[]> {
    return this.prismaService.service.findMany();
  }

  findById(id: number): Promise<Service | null> {
    return this.prismaService.service.findUnique({
      where: {
        id
      }
    });
  }

  editService(id: number, service: ServiceRegistryDto): Promise<Service> {
    return this.prismaService.service.update({
      where: { id },
      data:  service
    });
  }

  createService(service: ServiceRegistryDto): Promise<Service> {
    return this.prismaService.service.create({
      data: { apiKey: generateKey(), ...service }
    });
  }

  deleteService(id: number): Promise<Service> {
    return this.prismaService.service.delete({
      where: { id }
    });
  }

  async verifyApiKey(apiKey: string): Promise<boolean> {
    const service = await this.prismaService.service.findFirst({
      where: { apiKey }
    });

    return !service || service.status !== ServiceStatus.Available;
  }

  async getServiceByName(name: string): Promise<Service> {
    const service = await this.prismaService.service.findFirst({
      where: { name }
    });

    if (!service || service.status !== ServiceStatus.Available) {
      throw new BadRequestException({
        message: 'Servicio no esta disponible'
      });
    }

    return service;
  }
}
