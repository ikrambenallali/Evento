// ****Role****
// =============================================================================================================================
// Vérifie qu’un JWT valide est présent. Si non → 401 Unauthorized
// =============================================================================================================================
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Vérifier si la route est publique
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // accès autorisé sans JWT
    }

    // Sinon, appliquer JwtAuthGuard normal
    return super.canActivate(context);
  }
}

// *****utilise*****
// =============================================================================================================================
// Sur toutes les routes nécessitant une authentification. Base de tous les autres guards.
// =============================================================================================================================    