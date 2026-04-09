/**
 * RBAC Service - Test Examples
 * Ejemplos de pruebas unitarias para el sistema RBAC
 */

import { TestBed } from '@angular/core/testing';
import { RbacService, Role, Action, UserContext } from './';

describe('RbacService', () => {
  let service: RbacService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RbacService]
    });
    service = TestBed.inject(RbacService);
  });

  describe('User Management', () => {
    it('should set and get current user', () => {
      const user: UserContext = {
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'admin'
      };

      service.setCurrentUser(user);
      const currentUser = service.getCurrentUser();

      expect(currentUser).toEqual(user);
    });

    it('should clear current user', () => {
      const user: UserContext = {
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'admin'
      };

      service.setCurrentUser(user);
      service.clearCurrentUser();

      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('SUPER_ADMIN Permissions', () => {
    beforeEach(() => {
      const user: UserContext = {
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'super_admin'
      };
      service.setCurrentUser(user);
    });

    it('should allow creating tenants', () => {
      expect(service.can(Action.CREATE_TENANT)).toBe(true);
    });

    it('should allow viewing all tenants', () => {
      expect(service.can(Action.GET_ALL_TENANTS)).toBe(true);
    });

    it('should allow creating users', () => {
      expect(service.can(Action.CREATE_USERS, 'tenant-1')).toBe(true);
    });

    it('should allow viewing global metrics', () => {
      expect(service.can(Action.GET_GLOBAL_METRICS)).toBe(true);
    });

    it('should have all permissions', () => {
      const actions = service.getPermittedActions();
      expect(actions).toContain(Action.CREATE_TENANT);
      expect(actions).toContain(Action.GET_ALL_TENANTS);
      expect(actions).toContain(Action.CREATE_USERS);
      expect(actions).toContain(Action.GET_GLOBAL_METRICS);
    });
  });

  describe('SUPPORT Permissions', () => {
    beforeEach(() => {
      const user: UserContext = {
        id: '2',
        role: Role.SUPPORT,
        tenantId: 'tenant-1',
        username: 'support'
      };
      service.setCurrentUser(user);
    });

    it('should NOT allow creating tenants', () => {
      expect(service.can(Action.CREATE_TENANT)).toBe(false);
    });

    it('should allow viewing all tenants', () => {
      expect(service.can(Action.GET_ALL_TENANTS)).toBe(true);
    });

    it('should NOT allow creating users', () => {
      expect(service.can(Action.CREATE_USERS, 'tenant-1')).toBe(false);
    });

    it('should allow viewing global metrics', () => {
      expect(service.can(Action.GET_GLOBAL_METRICS)).toBe(true);
    });

    it('should allow viewing company metrics', () => {
      expect(service.can(Action.GET_COMPANY_METRICS, 'tenant-1')).toBe(true);
    });

    it('should allow editing users', () => {
      expect(service.can(Action.EDIT_USERS, 'tenant-1')).toBe(true);
    });

    it('should allow linking machine to customer', () => {
      expect(service.can(Action.LINK_MACHINE_TO_CUSTOMER, 'tenant-1')).toBe(true);
    });
  });

  describe('ADMIN Permissions', () => {
    beforeEach(() => {
      const user: UserContext = {
        id: '3',
        role: Role.ADMIN,
        tenantId: 'tenant-2',
        username: 'admin_company'
      };
      service.setCurrentUser(user);
    });

    it('should NOT allow creating tenants', () => {
      expect(service.can(Action.CREATE_TENANT)).toBe(false);
    });

    it('should NOT allow viewing all tenants', () => {
      expect(service.can(Action.GET_ALL_TENANTS)).toBe(false);
    });

    it('should allow creating users in their tenant', () => {
      expect(service.can(Action.CREATE_USERS, 'tenant-2')).toBe(true);
    });

    it('should NOT allow creating users in other tenant', () => {
      expect(service.can(Action.CREATE_USERS, 'tenant-3')).toBe(false);
    });

    it('should NOT allow viewing global metrics', () => {
      expect(service.can(Action.GET_GLOBAL_METRICS)).toBe(false);
    });

    it('should allow viewing company metrics', () => {
      expect(service.can(Action.GET_COMPANY_METRICS, 'tenant-2')).toBe(true);
    });

    it('should NOT allow viewing company metrics from other tenant', () => {
      expect(service.can(Action.GET_COMPANY_METRICS, 'tenant-3')).toBe(false);
    });

    it('should allow linking machine with NFC', () => {
      expect(service.can(Action.LINK_MACHINE_WITH_NFC, 'tenant-2')).toBe(true);
    });

    it('should NOT allow linking machine with NFC from other tenant', () => {
      expect(service.can(Action.LINK_MACHINE_WITH_NFC, 'tenant-3')).toBe(false);
    });
  });

  describe('Role Checks', () => {
    it('should identify SUPER_ADMIN', () => {
      service.setCurrentUser({
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'admin'
      });

      expect(service.isSuperAdmin()).toBe(true);
      expect(service.isSupport()).toBe(false);
      expect(service.isAdmin()).toBe(false);
    });

    it('should identify SUPPORT', () => {
      service.setCurrentUser({
        id: '2',
        role: Role.SUPPORT,
        tenantId: 'tenant-1',
        username: 'support'
      });

      expect(service.isSuperAdmin()).toBe(false);
      expect(service.isSupport()).toBe(true);
      expect(service.isAdmin()).toBe(false);
    });

    it('should identify ADMIN', () => {
      service.setCurrentUser({
        id: '3',
        role: Role.ADMIN,
        tenantId: 'tenant-2',
        username: 'admin'
      });

      expect(service.isSuperAdmin()).toBe(false);
      expect(service.isSupport()).toBe(false);
      expect(service.isAdmin()).toBe(true);
    });

    it('should check multiple roles with hasRole', () => {
      service.setCurrentUser({
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'admin'
      });

      expect(service.hasRole(Role.SUPER_ADMIN)).toBe(true);
      expect(service.hasRole(Role.SUPER_ADMIN, Role.SUPPORT)).toBe(true);
      expect(service.hasRole(Role.SUPPORT, Role.ADMIN)).toBe(false);
    });
  });

  describe('Tenant Access Validation', () => {
    it('should allow SUPER_ADMIN to access any tenant', () => {
      service.setCurrentUser({
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'admin'
      });

      expect(service.validateTenantAccess('tenant-1')).toBe(true);
      expect(service.validateTenantAccess('tenant-2')).toBe(true);
      expect(service.validateTenantAccess('tenant-3')).toBe(true);
    });

    it('should allow SUPPORT to access any tenant', () => {
      service.setCurrentUser({
        id: '2',
        role: Role.SUPPORT,
        tenantId: 'tenant-1',
        username: 'support'
      });

      expect(service.validateTenantAccess('tenant-1')).toBe(true);
      expect(service.validateTenantAccess('tenant-2')).toBe(true);
    });

    it('should allow ADMIN to access only their tenant', () => {
      service.setCurrentUser({
        id: '3',
        role: Role.ADMIN,
        tenantId: 'tenant-2',
        username: 'admin'
      });

      expect(service.validateTenantAccess('tenant-2')).toBe(true);
      expect(service.validateTenantAccess('tenant-1')).toBe(false);
      expect(service.validateTenantAccess('tenant-3')).toBe(false);
    });
  });

  describe('Permitted Actions', () => {
    it('should return all actions for SUPER_ADMIN', () => {
      service.setCurrentUser({
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'admin'
      });

      const actions = service.getPermittedActions();
      const expectedCount = 9; // Total de acciones definidas

      expect(actions.length).toBe(expectedCount);
    });

    it('should return filtered actions for SUPPORT', () => {
      service.setCurrentUser({
        id: '2',
        role: Role.SUPPORT,
        tenantId: 'tenant-1',
        username: 'support'
      });

      const actions = service.getPermittedActions();

      expect(actions).toContain(Action.GET_ALL_TENANTS);
      expect(actions).toContain(Action.GET_GLOBAL_METRICS);
      expect(actions).not.toContain(Action.CREATE_TENANT);
    });

    it('should return filtered actions for ADMIN', () => {
      service.setCurrentUser({
        id: '3',
        role: Role.ADMIN,
        tenantId: 'tenant-2',
        username: 'admin'
      });

      const actions = service.getPermittedActions();

      expect(actions).toContain(Action.CREATE_USERS);
      expect(actions).toContain(Action.GET_COMPANY_METRICS);
      expect(actions).not.toContain(Action.CREATE_TENANT);
      expect(actions).not.toContain(Action.GET_ALL_TENANTS);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing user context', () => {
      service.clearCurrentUser();

      expect(service.can(Action.CREATE_TENANT)).toBe(false);
      expect(service.isSuperAdmin()).toBe(false);
      expect(service.getPermittedActions()).toEqual([]);
    });

    it('should handle missing tenantId when required', () => {
      service.setCurrentUser({
        id: '3',
        role: Role.ADMIN,
        tenantId: 'tenant-2',
        username: 'admin'
      });

      // CREATE_USERS requiere tenantId
      expect(service.can(Action.CREATE_USERS)).toBe(false);
      expect(service.can(Action.CREATE_USERS, '')).toBe(false);
    });

    it('should handle actions not in config', () => {
      service.setCurrentUser({
        id: '1',
        role: Role.SUPER_ADMIN,
        tenantId: 'tenant-1',
        username: 'admin'
      });

      // Acción inexistente
      expect(() => {
        service.can('invalidAction' as any);
      }).not.toThrow();
    });
  });

  describe('Role Permissions Matrix', () => {
    it('should have correct permissions structure', () => {
      const superAdminActions = service.getPermittedActionsForRole(Role.SUPER_ADMIN);
      expect(superAdminActions.length).toBeGreaterThan(0);

      const supportActions = service.getPermittedActionsForRole(Role.SUPPORT);
      expect(supportActions.length).toBeGreaterThan(0);

      const adminActions = service.getPermittedActionsForRole(Role.ADMIN);
      expect(adminActions.length).toBeGreaterThan(0);

      // SUPER_ADMIN debería tener más permisos que SUPPORT
      expect(superAdminActions.length).toBeGreaterThanOrEqual(supportActions.length);
    });
  });
});
