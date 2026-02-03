// ****role*****
// =============================================================================================================================
// Déclare les rôles autorisés sur une route. Sert à RolesGuard pour vérifier l’accès. Exemple : @Roles(Role.ADMIN)
// =============================================================================================================================
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);
