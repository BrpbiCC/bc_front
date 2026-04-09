# 🔐 Sistema RBAC (Role-Based Access Control)

Control de acceso basado en roles para aplicación Angular multi-tenant.

## 📁 Estructura de Archivos

```
src/app/core/rbac/
├── rbac.types.ts              # Definición de tipos e interfaces
├── rbac.config.ts            # Configuración de permisos por rol
├── rbac.service.ts           # Servicio centralizado de RBAC
├── rbac.guard.ts             # Route guard para proteger rutas
├── can.directive.ts          # Directiva *appCan para templates
├── rbac.service.spec.ts      # Tests unitarios
├── RBAC-GUIDE.md             # Guía completa de uso
└── index.ts                  # Exportaciones centralizadas
```

## 🚀 Inicio Rápido

### 1. Importar en tu Componente

```typescript
import { Component } from '@angular/core';
import { RbacService, Action, CanDirective } from '../../core/rbac';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, CanDirective], // Agregar CanDirective
  template: `...`
})
export class MyComponent {
  constructor(private rbac: RbacService) {}
}
```

### 2. Establecer Usuario (en Login)

```typescript
import { UserContext, Role } from '../../core/rbac';

const user: UserContext = {
  id: 'user123',
  role: Role.ADMIN,
  tenantId: 'company-456',
  username: 'john.doe'
};

this.rbacService.setCurrentUser(user);
```

### 3. Verificar Permisos en Template

```html
<!-- Mostrar solo si tiene permiso -->
<button *appCan="'createUsers'">Crear Usuario</button>

<!-- Panel solo para SUPER_ADMIN -->
<div *ngIf="isSuperAdmin()">
  <h3>Panel Administrativo</h3>
</div>
```

### 4. Verificar Permisos en TypeScript

```typescript
if (this.rbacService.can(Action.CREATE_USERS, tenantId)) {
  // Permitir acción
}
```

### 5. Proteger Rutas

```typescript
import { RbacGuard, Role, Action } from './core/rbac';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [RbacGuard],
    data: { requiredRole: Role.SUPER_ADMIN },
    component: AdminComponent
  }
];
```

## 📋 Roles Disponibles

| Rol | Descripción |
|-----|-------------|
| `SUPER_ADMIN` | Acceso total a todas las funcionalidades |
| `SUPPORT` | Soporte técnico con acceso a múltiples tenants |
| `ADMIN` | Administrador de empresa (solo su tenant) |

## 🔑 Acciones/Permisos

### Gestión de Tenants
- `createTenant` - Crear nuevo tenant
- `getAllTenants` - Ver todos los tenants
- `getOwnTenant` - Ver su propio tenant

### Gestión de Usuarios
- `createUsers` - Crear usuarios (en su tenant)
- `editUsers` - Editar usuarios (en su tenant)

### Métricas
- `getGlobalMetrics` - Ver métricas globales
- `getCompanyMetrics` - Ver métricas de su empresa

### Máquinas y NFC
- `linkMachineWithNFC` - Vincular máquina con NFC
- `linkMachineToCustomer` - Vincular máquina a cliente

## 💡 Métodos Principales del Servicio

```typescript
// Verificar si puede realizar una acción
can(action: Action, tenantId?: string): boolean

// Verificar rol
isSuperAdmin(): boolean
isSupport(): boolean
isAdmin(): boolean
hasRole(...roles: Role[]): boolean

// Obtener información
getCurrentUser(): UserContext | null
getPermittedActions(): Action[]
getPermittedActionsForRole(role: Role): Action[]

// Validar acceso a tenant
validateTenantAccess(tenantId: string): boolean

// Gestión del usuario actual
setCurrentUser(user: UserContext): void
clearCurrentUser(): void

// Observables
getCurrentUser$(): Observable<UserContext | null>

// Debugging
debugCurrentUserPermissions(): void
```

## 🎯 Matriz de Permisos

### SUPER_ADMIN ✓
```
✓ createTenant
✓ getAllTenants
✓ getOwnTenant
✓ createUsers (en cualquier tenant)
✓ editUsers (en cualquier tenant)
✓ getGlobalMetrics
✓ getCompanyMetrics
✓ linkMachineWithNFC
✓ linkMachineToCustomer
```

### SUPPORT ✓
```
✗ createTenant
✓ getAllTenants
✓ getOwnTenant
✗ createUsers
✓ editUsers
✓ getGlobalMetrics
✓ getCompanyMetrics
✗ linkMachineWithNFC
✓ linkMachineToCustomer
```

### ADMIN ✓
```
✗ createTenant
✗ getAllTenants
✓ getOwnTenant
✓ createUsers (solo su tenant)
✓ editUsers (solo su tenant)
✗ getGlobalMetrics
✓ getCompanyMetrics (su tenant)
✓ linkMachineWithNFC (su tenant)
✓ linkMachineToCustomer (su tenant)
```

## 📚 Ejemplos de Uso

### Mostrar/Ocultar Botones

```html
<!-- Directiva más simple -->
<button *appCan="'createTenant'" (click)="createTenant()">
  Crear Tenant
</button>

<!-- Con tenantId específico -->
<button *appCan="'editUsers'; appCanTenant: currentTenantId">
  Editar Usuarios
</button>

<!-- Condicional en TypeScript -->
<button *ngIf="rbac.can(Action.CREATE_USERS, tenantId)">
  Crear Usuario
</button>
```

### Condicionales por Rol

```html
<!-- Panel solo para SUPER_ADMIN -->
<div *ngIf="rbac.isSuperAdmin()" class="admin-panel">
  <h3>Panel Administrativo</h3>
</div>

<!-- Panel solo para SUPPORT y SUPER_ADMIN -->
<div *ngIf="rbac.hasRole(Role.SUPPORT, Role.SUPER_ADMIN)">
  <h3>Centro de Soporte</h3>
</div>
```

### Protección de Rutas

```typescript
// Route guard con rol requerido
{
  path: 'admin',
  canActivate: [RbacGuard],
  data: { requiredRole: Role.SUPER_ADMIN },
  component: AdminComponent
}

// Route guard con acción requerida
{
  path: 'tenants',
  canActivate: [RbacGuard],
  data: { requiredAction: Action.CREATE_TENANT },
  component: TenantsComponent
}

// Route guard con múltiples roles
{
  path: 'support',
  canActivate: [RbacGuard],
  data: { requiredRole: [Role.SUPER_ADMIN, Role.SUPPORT] },
  component: SupportComponent
}
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**: El RBAC de frontend es **solo para UX** (mostrar/ocultar elementos).

**SIEMPRE valida en backend también:**

```typescript
// Frontend - UX
if (this.rbac.can(Action.DELETE_USER)) {
  this.userService.deleteUser(userId).subscribe(...);
}

// Backend - Seguridad
@Post('/users/:id/delete')
@RbacGuard(Action.DELETE_USER)
deleteUser(@Param('id') id: string) {
  // Valida el permiso en el servidor
  return this.userService.delete(id);
}
```

## 🧪 Testing

```typescript
// Configurar usuario de prueba
const user: UserContext = {
  id: 'test-user',
  role: Role.ADMIN,
  tenantId: 'test-tenant',
  username: 'test'
};

service.setCurrentUser(user);

// Verificar permisos
expect(service.can(Action.CREATE_USERS, 'test-tenant')).toBe(true);
expect(service.can(Action.CREATE_TENANT)).toBe(false);
```

## ⚙️ Extensión/Customización

### Agregar Nuevo Permiso

1. **Definir acción** en `rbac.types.ts`:
```typescript
export enum Action {
  // ... existentes
  DELETE_TENANT = 'deleteTenant'
}
```

2. **Configurar regla** en `rbac.config.ts`:
```typescript
[Action.DELETE_TENANT]: {
  roles: [Role.SUPER_ADMIN],
  requiresTenantId: true,
  tenantIdMatches: true
}
```

3. **Actualizar matriz** en `rbac.config.ts`:
```typescript
export const ROLE_PERMISSIONS: Record<Role, Action[]> = {
  [Role.SUPER_ADMIN]: [
    // ... existentes
    Action.DELETE_TENANT
  ]
}
```

### Lógica Personalizada

```typescript
// Extender servicio para caso específico
export class RbacExtendedService {
  constructor(private rbac: RbacService) {}

  canDeleteUser(userId: string): boolean {
    const current = this.rbac.getCurrentUser();
    if (!current) return false;

    // Lógica personalizada
    if (current.id === userId) return false; // No puede eliminarse a sí mismo
    
    return this.rbac.can(Action.EDIT_USERS);
  }
}
```

## 📖 Documentación Completa

Ver [RBAC-GUIDE.md](./RBAC-GUIDE.md) para guía detallada con ejemplos completos.

## 🐛 Debugging

```typescript
// Ver todos los permisos del usuario actual
this.rbac.debugCurrentUserPermissions();

// Ver usuario actual
console.log(this.rbac.getCurrentUser());

// Ver acciones permitidas
console.log(this.rbac.getPermittedActions());
```

## ✅ Checklist de Implementación

- [ ] Importar `RbacService` en componentes que lo necesiten
- [ ] Configurar usuario al login
- [ ] Limpiar usuario al logout
- [ ] Importar `CanDirective` en componentes con `*appCan`
- [ ] Aplicar `RbacGuard` en rutas protegidas
- [ ] Validar permisos en backend
- [ ] Testear casos de acceso denegado
- [ ] Documentar permisos específicos de negocio

---

**¿Problemas?** Revisa [RBAC-GUIDE.md](./RBAC-GUIDE.md) o los tests en `rbac.service.spec.ts`.
