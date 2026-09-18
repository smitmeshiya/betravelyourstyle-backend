import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;   // user UUID
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuardService {
  constructor(private readonly jwtService: JwtService) {}

  // Generate a signed JWT for the given payload
  async generateToken(
    payload: Omit<JwtPayload, 'iat' | 'exp'>,
    options?: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options ?? {});
  }

  // Verify and decode a JWT — throws UnauthorizedException on failure
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (error: any) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
