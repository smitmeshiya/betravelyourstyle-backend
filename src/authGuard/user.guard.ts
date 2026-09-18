import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuardService } from './jwt.guard';
import { CommonMessages } from 'src/common/common-message';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly authService: AuthGuardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers['x-access-token'];

      if (!token) {
        throw new UnauthorizedException(CommonMessages.not_found('Token'));
      }

      // Verify JWT and decode payload { sub, email, role }
      const payload = await this.authService.verifyToken(token);

      if (payload.role !== 'user') {
        throw new ForbiddenException('User access only');
      }

      // Attach decoded user to request (sub = user UUID)
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (error: any) {
      console.error('Error in UserGuard:', error);
      throw error;
    }
  }
}
