/**
 * RBAC Permissions Configuration
 * Define la matriz de permisos para cada rol
 */

import { Role, Action, AccessRule } from './rbac.types';

/**
 * Definición de permisos por rol
 * Estructura: { action: { roles: [...], requirements: ... } }
 */
export const RBAC_PERMISSIONS: Record<Action, AccessRule> = {
  /* ==================== TENANT MANAGEMENT ==================== */
  [Action.CREATE_TENANT]: {
    roles: [Role.SUPER_ADMIN]
  },

  [Action.GET_ALL_TENANTS]: {
    roles: [Role.SUPER_ADMIN, Role.SUPPORT]
  },

  [Action.GET_OWN_TENANT]: {
    roles: [Role.SUPER_ADMIN, Role.SUPPORT, Role.ADMIN],
    requiresTenantId: false
  },

  /* ==================== USER MANAGEMENT ==================== */
  [Action.CREATE_USERS]: {
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
    requiresTenantId: true,
    tenantIdMatches: true // El tenantId del usuario debe coincidir
  },

  [Action.EDIT_USERS]: {
    roles: [Role.SUPER_ADMIN, Role.SUPPORT, Role.ADMIN],
    requiresTenantId: true,
    tenantIdMatches: true
  },

  /* ==================== METRICS & ANALYTICS ==================== */
  [Action.GET_GLOBAL_METRICS]: {
    roles: [Role.SUPER_ADMIN, Role.SUPPORT]
  },

  [Action.GET_COMPANY_METRICS]: {
    roles: [Role.SUPER_ADMIN, Role.SUPPORT, Role.ADMIN],
    requiresTenantId: true,
    tenantIdMatches: true
  },

  /* ==================== MACHINE & NFC MANAGEMENT ==================== */
  [Action.LINK_MACHINE_WITH_NFC]: {
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
    requiresTenantId: true,
    tenantIdMatches: true
  },

  [Action.LINK_MACHINE_TO_CUSTOMER]: {
    roles: [Role.SUPER_ADMIN, Role.SUPPORT, Role.ADMIN],
    requiresTenantId: true,
    tenantIdMatches: true
  }
};

/**
 * Matriz de permisos simplificada por rol
 * Útil para debugging y visualización rápida
 */
export const ROLE_PERMISSIONS: Record<Role, Action[]> = {
  [Role.SUPER_ADMIN]: [
    Action.CREATE_TENANT,
    Action.GET_ALL_TENANTS,
    Action.GET_OWN_TENANT,
    Action.CREATE_USERS,
    Action.GET_GLOBAL_METRICS,
    Action.GET_COMPANY_METRICS,
    Action.LINK_MACHINE_WITH_NFC,
    Action.LINK_MACHINE_TO_CUSTOMER,
    Action.EDIT_USERS
  ],
  [Role.SUPPORT]: [
    Action.GET_ALL_TENANTS,
    Action.GET_OWN_TENANT,
    Action.GET_GLOBAL_METRICS,
    Action.GET_COMPANY_METRICS,
    Action.LINK_MACHINE_TO_CUSTOMER,
    Action.EDIT_USERS
  ],
  [Role.ADMIN]: [
    Action.GET_OWN_TENANT,
    Action.CREATE_USERS,
    Action.GET_COMPANY_METRICS,
    Action.LINK_MACHINE_WITH_NFC,
    Action.LINK_MACHINE_TO_CUSTOMER
  ]
};
