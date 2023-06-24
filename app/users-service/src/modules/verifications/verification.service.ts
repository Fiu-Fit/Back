import { Page } from '@fiu-fit/common';
import { Injectable } from '@nestjs/common';
import { RequestStatus, Verification } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

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
        requestStatus: RequestStatus.Pending
      }
    });
  }

  updateVerification(
    id: number,
    verification: Verification
  ): Promise<Verification> {
    return this.prismaService.verification.update({
      where: { id },
      data:  verification
    });
  }

  async getVerificationRequests(
    requestStatus?: RequestStatus
  ): Promise<Page<Verification>> {
    const verificationRequests = await this.prismaService.verification.findMany(
      {
        where: { requestStatus }
      }
    );
    return {
      rows:  verificationRequests,
      count: verificationRequests.length
    };
  }
}
