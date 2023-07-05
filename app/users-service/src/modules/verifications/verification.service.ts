import { Page } from '@fiu-fit/common';
import { Injectable } from '@nestjs/common';
import { RequestStatus, Verification } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { EditVerificationDto } from './dto';

@Injectable()
export class VerificationService {
  constructor(private prismaService: PrismaService) {}

  addVerificationRequest(
    userId: number,
    resourceId: string
  ): Promise<Verification> {
    return this.prismaService.verification.create({
      data: {
        userId,
        resourceId,
        status: RequestStatus.Pending
      }
    });
  }

  updateVerification(
    id: number,
    verification: EditVerificationDto
  ): Promise<Verification | null> {
    return this.prismaService.verification.update({
      where: { id },
      data:  verification
    });
  }

  async getVerificationRequests(
    status?: RequestStatus
  ): Promise<Page<Verification>> {
    const verificationRequests = await this.prismaService.verification.findMany(
      {
        where: { status }
      }
    );
    const count = await this.prismaService.verification.count({
      where: { status }
    });
    return {
      rows:  verificationRequests,
      count: count
    };
  }

  getVerification(id: number): Promise<Verification | null> {
    return this.prismaService.verification.findUnique({
      where: { id }
    });
  }

  getVerificationByUserId(userId: number): Promise<Verification | null> {
    return this.prismaService.verification.findFirst({
      where: { userId }
    });
  }
}
