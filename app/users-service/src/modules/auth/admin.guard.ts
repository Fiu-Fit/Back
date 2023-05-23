import { LoggerFactory } from '@fiu-fit/common';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { firebaseAdmin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';

const logger = LoggerFactory('AdminGuard');

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    let decodedToken: DecodedIdToken;
    const request = ctx.switchToHttp().getRequest();

    try {
      const token = request.headers.authorization.split(' ')[1];
      decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      logger.info('token: ', decodedToken);
    } catch (err) {
      logger.error('Error verifying token: ', err);
      throw new UnauthorizedException({
        message: 'Invalid token: user not found or not an admin'
      });
    }

    const email = decodedToken.email;
    if (!email)
      throw new InternalServerErrorException({
        message: 'No email in token payload'
      });

    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.role !== Role.Admin) {
      throw new UnauthorizedException({
        message: 'Invalid token: user not found or not an admin'
      });
    }

    request.user = decodedToken;
    return true;
  }
}
