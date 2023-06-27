export interface Token {
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export class LoginRequest {
  email: string;

  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}
