/**
 * RBAC Route Guard
 * Protege rutas basándose en roles y permisos
 */

import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { RbacService } from './rbac.service';
import { Action, Role } from './rbac.types';

@Injectable({
  providedIn: 'root'
})
export class RbacGuard implements CanActivate {
  constructor(private rbacService: RbacService, private router: Router) {}

  /**
   * Verifica si la ruta puede ser activada
   * Espera que la ruta tenga datos: { requiredRole: Role | Role[], requiredAction: Action }
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const requiredRoles: Role[] | undefined = route.data['requiredRole'];
    const requiredAction: Action | undefined = route.data['requiredAction'];

    // Si no hay requisitos, permitir acceso
    if (!requiredRoles && !requiredAction) {
      return true;
    }

    const user = this.rbacService.getCurrentUser();

    if (!user) {
      console.warn('[RBAC Guard] No user authenticated');
      return this.router.createUrlTree(['/login']);
    }

    // Verificar si tiene el rol requerido
    if (requiredRoles) {
      const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      if (!rolesArray.includes(user.role)) {
        console.warn(
          `[RBAC Guard] User "${user.username}" with role "${user.role}" is not allowed to access "${state.url}"`
        );
        return this.router.createUrlTree(['/unauthorized']);
      }
    }

    // Verificar si tiene la acción/permiso requerido
    if (requiredAction) {
      if (!this.rbacService.can(requiredAction, user.tenantId)) {
        console.warn(
          `[RBAC Guard] User "${user.username}" does not have permission for action "${requiredAction}"`
        );
        return this.router.createUrlTree(['/unauthorized']);
      }
    }

    return true;
  }
}
