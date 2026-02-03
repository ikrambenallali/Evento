import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { SelfOrAdminGuard } from './guards/self-or-admin.guard';

@Module({
  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    SelfOrAdminGuard,

  ],

})
export class AuthModule { }
