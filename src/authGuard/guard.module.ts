import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth/auth.module';

// GuardModule is a thin re-export wrapper so any future feature module
// can import GuardModule to get AuthGuardService, UserGuard, AdminGuard.
@Module({
  imports: [AuthModule],
  exports: [AuthModule],
})
export class GuardModule {}
