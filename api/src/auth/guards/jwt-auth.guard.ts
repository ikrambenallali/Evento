// ****Role****
// =============================================================================================================================
// Vérifie qu’un JWT valide est présent. Si non → 401 Unauthorized
// =============================================================================================================================
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// *****utilise*****
// =============================================================================================================================
// Sur toutes les routes nécessitant une authentification. Base de tous les autres guards.
// =============================================================================================================================    