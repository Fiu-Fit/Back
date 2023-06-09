import {
  Body,
  Controller,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminGuard } from './admin.guard';
import { AuthService } from './auth.service';
import {
  AdminRegisterRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() newUser: RegisterRequest): Promise<{ token: string }> {
    if (newUser.role === Role.Admin)
      throw new UnauthorizedException({
        message: 'Use /admin/register to register an admin'
      });
    return this.authService.register(newUser);
  }

  @Post('login')
  login(@Body() loginInfo: LoginRequest): Promise<{ token: string }> {
    return this.authService.login(loginInfo);
  }

  @UseGuards(AdminGuard)
  @Post('admin/register')
  adminRegister(
    @Body() newUser: AdminRegisterRequest
  ): Promise<{ token: string }> {
    const registerRequest: RegisterRequest = {
      ...newUser,
      role:        Role.Admin,
      bodyWeight:  -1,
      phoneNumber: ''
    };
    return this.authService.register(registerRequest);
  }

  @Post('admin/login')
  adminLogin(@Body() loginInfo: LoginRequest): Promise<{ token: string }> {
    return this.authService.adminLogin(loginInfo);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('password-reset')
  async resetPassword(@Body() body: ResetPasswordRequest) {
    await this.authService.resetPassword(body.email);
  }

  @Patch('confirm-registration')
  confirmRegistration(
    @Body('confirmationPIN') confirmationPIN: string,
    @Body('userId') userId: number
  ) {
    return this.authService.confirmRegistration(userId, confirmationPIN);
  }
}
