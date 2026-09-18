import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuardService } from './jwt.guard';
import { CommonMessages } from 'src/common/common-message';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from 'src/schema/users.schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthGuardService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers['x-access-token'];

      if (!token) {
        throw new UnauthorizedException(CommonMessages.not_found('Token'));
      }

      // Verify JWT and decode payload { sub, email, role }
      const payload = await this.authService.verifyToken(token);

      if (payload.role !== 'admin') {
        throw new ForbiddenException('Admin access only');
      }

      // Double-check the user still exists and is not soft-deleted
      const dbUser = await this.userRepo.findOne({
        where: {
          id: payload.sub,
          deleted_at: IsNull(),
        },
        select: ['id', 'role', 'email'],
      });

      if (!dbUser) {
        throw new ForbiddenException('Admin account not found');
      }

      if (dbUser.role !== 'admin') {
        throw new ForbiddenException('Admin access only');
      }

      // Attach decoded user to request
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (error: any) {
      console.error('Error in AdminGuard:', error);
      throw error;
    }
  }
}
