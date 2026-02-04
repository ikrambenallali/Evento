// *****role******
// =============================================================================================================================
// Valide JWT, remplit request.user
// =============================================================================================================================
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

 async validate(payload: any) {
  console.log('🔑 JWT Payload reçu:', payload); // Debug
    // ✅ VALIDATION : Vérifier que le payload contient les données nécessaires
    if (!payload.sub) {
      console.error('❌ JWT invalide : payload.sub est manquant');
      throw new UnauthorizedException('Invalid token: missing user ID');
    }
  return {
    id: payload.sub, 
    email: payload.email,
    role: payload.role,
  };
}

}
