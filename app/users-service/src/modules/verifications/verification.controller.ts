import { Page } from '@fiu-fit/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { Verification } from '@prisma/client';
import { VerificationService } from './verification.service';

@Controller('verifications')
@Injectable()
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  addVerification(
    @Body('userId') userId: number,
    @Body('resourceId') resourceId: string
  ): Promise<Verification> {
    if (!userId || !resourceId) {
      throw new BadRequestException({
        message: 'Id de usuario y video de verificacion son requeridos'
      });
    }

    return this.verificationService.addVerificationRequest(userId, resourceId);
  }

  @Get()
  getVerifications(): Promise<Page<Verification>> {
    return this.verificationService.getVerificationRequests();
  }

  @Get(':id')
  async getVerification(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Verification> {
    const verification = await this.verificationService.getVerification(id);

    if (!verification) {
      throw new NotFoundException({ message: 'Verification not found' });
    }

    return verification;
  }

  @Put(':id')
  async updateVerification(
    @Param('id', ParseIntPipe) id: number,
    @Body() verification: Verification
  ): Promise<Verification> {
    const updatedVerification =
      await this.verificationService.updateVerification(id, verification);

    if (!updatedVerification) {
      throw new NotFoundException({ message: 'Verification not found' });
    }

    return updatedVerification;
  }

  @Get('user/:userId')
  async getVerificationByUserId(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<Verification> {
    const verification = await this.verificationService.getVerificationByUserId(
      userId
    );

    if (!verification) {
      throw new NotFoundException({ message: 'Verification not found' });
    }

    return verification;
  }
}
