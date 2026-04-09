/**
 * RBAC Types and Interfaces
 * Define los tipos principales para el sistema de control de acceso
 */

/**
 * Roles disponibles en la aplicación
 */
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

/**
 * Acciones/Permisos disponibles
 */
export enum Action {
  CREATE_TENANT = 'createTenant',
  GET_ALL_TENANTS = 'getAllTenants',
  GET_OWN_TENANT = 'getOwnTenant',
  CREATE_USERS = 'createUsers',
  GET_GLOBAL_METRICS = 'getGlobalMetrics',
  GET_COMPANY_METRICS = 'getCompanyMetrics',
  LINK_MACHINE_WITH_NFC = 'linkMachineWithNFC',
  LINK_MACHINE_TO_CUSTOMER = 'linkMachineToCustomer',
  EDIT_USERS = 'editUsers'
}

/**
 * Contexto del usuario actual
 */
export interface UserContext {
  id: string;
  role: Role;
  tenantId: string;
  username: string;
}

/**
 * Resultado de verificación de permiso
 */
export interface Permission {
  role: Role;
  actions: Action[];
}

/**
 * Definición de regla de control de acceso
 */
export interface AccessRule {
  roles: Role[];
  requiresTenantId?: boolean;
  tenantIdMatches?: boolean; // Si es true, requiere que el tenantId pasado coincida con el del usuario
}
