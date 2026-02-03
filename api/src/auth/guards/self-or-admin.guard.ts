// ****role****
// =============================================================================================================================
// Autorise l’accès si l’utilisateur est ADMIN ou si request.user.userId === paramId. Sinon → 403 Forbidden.
// ============================================================================================================================
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    // ✅ ADMIN → accès total
    if (user.role === Role.ADMIN) {
      return true;
    }

    // 🔍 ID ciblé dans l'URL
    const paramUserId =
      request.params.id ||
      request.params.userId;

    // 🧠 Comparaison avec l'utilisateur connecté
    if (paramUserId && paramUserId === user.userId) {
      return true;
    }

    throw new ForbiddenException(
      'You can only access your own resources',
    );
  }
}
// *****utilise*****
// =============================================================================================================================
// Routes où l’utilisateur peut accéder à ses propres données mais Admin peut accéder à tout.
// =============================================================================================================================
