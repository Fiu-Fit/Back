export interface JwtPayload {
  email: string;
  sub: number;
}

export interface Token {
  token: string;
  needsConfirmation: boolean;
}
