/**
 * RBAC Service
 * Servicio centralizado para verificar permisos y controlar acceso
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role, Action, UserContext } from './rbac.types';
import { RBAC_PERMISSIONS, ROLE_PERMISSIONS } from './rbac.config';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  private currentUserSubject = new BehaviorSubject<UserContext | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  /**
   * Establece el usuario actual (normalmente al login)
   */
  setCurrentUser(user: UserContext): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): UserContext | null {
    return this.currentUserSubject.value;
  }

  /**
   * Limpia el usuario actual (al logout)
   */
  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }

  /**
   * Verifica si el usuario actual puede realizar una acción
   * @param action - La acción a verificar
   * @param tenantId - ID del tenant (opcional, requerido para algunas acciones)
   * @returns true si el usuario tiene permiso
   */
  can(action: Action, tenantId?: string): boolean {
    const user = this.currentUserSubject.value;

    if (!user) {
      console.warn('[RBAC] No user context available');
      return false;
    }

    return this.hasPermission(user.role, action, user.tenantId, tenantId);
  }

  /**
   * Verifica si un rol específico tiene permiso para una acción
   * @param role - El rol a verificar
   * @param action - La acción a verificar
   * @param userTenantId - ID del tenant del usuario
   * @param actionTenantId - ID del tenant sobre el que se quiere actuar
   * @returns true si el rol tiene permiso
   */
  hasPermission(
    role: Role,
    action: Action,
    userTenantId: string,
    actionTenantId?: string
  ): boolean {
    const rule = RBAC_PERMISSIONS[action];

    if (!rule) {
      console.error(`[RBAC] Action "${action}" not found in permissions config`);
      return false;
    }

    // 1. Verificar si el rol tiene acceso a esta acción
    if (!rule.roles.includes(role)) {
      console.debug(`[RBAC] Role "${role}" not allowed for action "${action}"`);
      return false;
    }

    // 2. Verificar si la acción requiere tenantId
    if (rule.requiresTenantId && !actionTenantId) {
      console.debug(`[RBAC] Action "${action}" requires tenantId`);
      return false;
    }

    // 3. Verificar si el tenantId debe coincidir
    if (rule.tenantIdMatches && actionTenantId && actionTenantId !== userTenantId) {
      console.debug(
        `[RBAC] Tenant mismatch for action "${action}". User tenant: ${userTenantId}, Action tenant: ${actionTenantId}`
      );
      return false;
    }

    return true;
  }

  /**
   * Obtiene todas las acciones permitidas para el usuario actual
   * @returns Array de acciones permitidas
   */
  getPermittedActions(): Action[] {
    const user = this.currentUserSubject.value;

    if (!user) {
      return [];
    }

    return ROLE_PERMISSIONS[user.role] || [];
  }

  /**
   * Obtiene todas las acciones permitidas para un rol específico
   * @param role - El rol a verificar
   * @returns Array de acciones permitidas
   */
  getPermittedActionsForRole(role: Role): Action[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Verifica si el usuario es SUPER_ADMIN
   */
  isSuperAdmin(): boolean {
    return this.currentUserSubject.value?.role === Role.SUPER_ADMIN;
  }

  /**
   * Verifica si el usuario es SUPPORT
   */
  isSupport(): boolean {
    return this.currentUserSubject.value?.role === Role.SUPPORT;
  }

  /**
   * Verifica si el usuario es ADMIN
   */
  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === Role.ADMIN;
  }

  /**
   * Verifica si el usuario tiene uno de los roles especificados
   * @param roles - Array de roles a verificar
   */
  hasRole(...roles: Role[]): boolean {
    const userRole = this.currentUserSubject.value?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Obtiene la lista de acciones permitidas para un usuario específico
   * Útil para mostrar/ocultar elementos en la UI
   */
  getAvailableActions(): Record<Action, boolean> {
    const result: Record<Action, boolean> = {} as Record<Action, boolean>;
    const user = this.currentUserSubject.value;

    if (!user) {
      return result;
    }

    Object.values(Action).forEach((action) => {
      result[action as Action] = this.can(action as Action, user.tenantId);
    });

    return result;
  }

  /**
   * Valida si un tenantId pertenece al usuario actual
   */
  validateTenantAccess(tenantId: string): boolean {
    const user = this.currentUserSubject.value;

    if (!user) {
      return false;
    }

    // SUPER_ADMIN y SUPPORT pueden acceder a cualquier tenant
    if (user.role === Role.SUPER_ADMIN || user.role === Role.SUPPORT) {
      return true;
    }

    // ADMIN solo puede acceder a su propio tenant
    return user.tenantId === tenantId;
  }

  /**
   * Obtiene el contexto del usuario actual como Observable
   */
  getCurrentUser$(): Observable<UserContext | null> {
    return this.currentUser$;
  }

  /**
   * Debugging: Imprime todos los permisos del usuario actual
   */
  debugCurrentUserPermissions(): void {
    const user = this.currentUserSubject.value;

    if (!user) {
      console.log('[RBAC] No user context');
      return;
    }

    console.group(`[RBAC] Permissions for ${user.role} (${user.username})`);
    const actions = this.getPermittedActions();
    actions.forEach((action) => {
      console.log(`✓ ${action}`);
    });
    console.groupEnd();
  }
}
