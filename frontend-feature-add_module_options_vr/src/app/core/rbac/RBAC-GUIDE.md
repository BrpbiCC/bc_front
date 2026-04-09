# RBAC (Role-Based Access Control) - Guía Completa

## 📋 Índice
1. [Introducción](#introducción)
2. [Conceptos Fundamentales](#conceptos-fundamentales)
3. [Uso en Componentes](#uso-en-componentes)
4. [Protección de Rutas](#protección-de-rutas)
5. [Buenas Prácticas](#buenas-prácticas)
6. [Ejemplos Completos](#ejemplos-completos)

---

## Introducción

Este sistema RBAC proporciona control de acceso granular basado en roles para aplicaciones Angular multi-tenant. Permite:

- ✅ Controlar qué usuarios pueden realizar qué acciones
- ✅ Proteger rutas basadas en roles
- ✅ Mostrar/ocultar elementos de UI dinámicamente
- ✅ Validar acceso a recursos específicos

---

## Conceptos Fundamentales

### Roles
```typescript
enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}
```

### Acciones/Permisos
```typescript
enum Action {
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
```

### UserContext
```typescript
interface UserContext {
  id: string;
  role: Role;
  tenantId: string;
  username: string;
}
```

---

## Uso en Componentes

### 1. Inyectar el Servicio

```typescript
import { Component } from '@angular/core';
import { RbacService, Action } from '../../core/rbac';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `...`
})
export class DashboardComponent {
  constructor(private rbacService: RbacService) {}
}
```

### 2. Verificar Permisos en TypeScript

```typescript
// Verificar si puede realizar una acción
if (this.rbacService.can(Action.CREATE_TENANT)) {
  // Mostrar botón o habilitar funcionalidad
}

// Verificar rol específico
if (this.rbacService.isSuperAdmin()) {
  // Acceso de SUPER_ADMIN
}

// Verificar si tiene uno de varios roles
if (this.rbacService.hasRole(Role.SUPER_ADMIN, Role.SUPPORT)) {
  // Es SUPER_ADMIN o SUPPORT
}

// Obtener todas las acciones permitidas
const permittedActions = this.rbacService.getPermittedActions();

// Validar acceso a tenant específico
if (this.rbacService.validateTenantAccess(tenantId)) {
  // Usuario puede acceder a este tenant
}
```

### 3. Usar Directiva *appCan en Templates

```html
<!-- Mostrar botón solo si tiene permiso -->
<button *appCan="'createTenant'" class="btn btn-primary">
  Crear Tenant
</button>

<!-- Especificar tenantId para validaciones que lo requieren -->
<button *appCan="'linkMachineWithNFC'; appCanTenant: currentTenantId">
  Vincular Máquina
</button>

<!-- Múltiples elementos condicionales -->
<div *appCan="'getGlobalMetrics'" class="metrics-panel">
  <h3>Métricas Globales</h3>
  <!-- contenido -->
</div>

<div *appCan="'editUsers'" class="admin-actions">
  <button (click)="editUser()">Editar Usuario</button>
  <button (click)="deleteUser()">Eliminar Usuario</button>
</div>
```

---

## Protección de Rutas

### Configurar Guard en Rutas

```typescript
import { Routes } from '@angular/router';
import { RbacGuard, Role, Action } from './core/rbac';

export const routes: Routes = [
  {
    path: 'tenants',
    canActivate: [RbacGuard],
    data: { requiredAction: Action.CREATE_TENANT },
    component: TenantsComponent
  },
  {
    path: 'admin',
    canActivate: [RbacGuard],
    data: { requiredRole: Role.SUPER_ADMIN },
    component: AdminDashboardComponent
  },
  {
    path: 'support',
    canActivate: [RbacGuard],
    data: { requiredRole: [Role.SUPER_ADMIN, Role.SUPPORT] },
    component: SupportPanelComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  }
];
```

### Datos de Ruta Disponibles

| Dato | Tipo | Descripción |
|------|------|-------------|
| `requiredRole` | `Role \| Role[]` | Rol o array de roles requeridos |
| `requiredAction` | `Action` | Acción/permiso requerido |

---

## Buenas Prácticas

### 1. **Establecer Usuario al Login**

```typescript
// En el componente de login
login(username: string, password: string): void {
  // API call para autenticar...
  this.authService.login(username, password).subscribe(response => {
    const userContext: UserContext = {
      id: response.userId,
      role: response.role,
      tenantId: response.tenantId,
      username: response.username
    };
    
    this.rbacService.setCurrentUser(userContext);
    // Redirigir al dashboard
  });
}
```

### 2. **Limpiar Usuario al Logout**

```typescript
logout(): void {
  this.rbacService.clearCurrentUser();
  this.router.navigate(['/login']);
}
```

### 3. **Usar Observable currentUser$ para Reactividad**

```typescript
export class NavbarComponent implements OnInit {
  user$ = this.rbacService.getCurrentUser$();

  constructor(private rbacService: RbacService) {}

  ngOnInit(): void {
    this.user$.pipe(
      filter(user => user !== null)
    ).subscribe(user => {
      console.log('Usuario autenticado:', user.username);
    });
  }
}
```

### 4. **Validar en Backend También**

El RBAC de frontend es para UX. **SIEMPRE** valida en backend:

```typescript
// ❌ NO confíes solo en frontend
if (can(Action.DELETE_TENANT)) {
  this.api.deleteTenant(id).subscribe(...);
}

// ✅ DO: Valida en backend también
this.api.deleteTenant(id).subscribe(
  success => { /* OK */ },
  error => {
    if (error.status === 403) {
      console.error('No tienes permiso para esta acción');
    }
  }
);
```

### 5. **Debugging: Ver Permisos del Usuario**

```typescript
// En la consola de desarrollador
this.rbacService.debugCurrentUserPermissions();

// También puedes inspeccionar directamente
const user = this.rbacService.getCurrentUser();
const actions = this.rbacService.getPermittedActions();
console.log('Acciones permitidas:', actions);
```

### 6. **Manejar Cambios de Rol Dinámicamente**

```typescript
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser$ = this.rbacService.getCurrentUser$();
  private destroy$ = new Subject<void>();

  constructor(private rbacService: RbacService) {}

  ngOnInit(): void {
    // Reacciona a cambios del usuario
    this.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(user => {
        if (user) {
          console.log('Usuario cambió a:', user.role);
          // Recargar datos o UI
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 7. **Agregar Locales para Nombres Humanizados**

```typescript
// rbac.locales.ts
export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Administrador Super',
  [Role.SUPPORT]: 'Soporte',
  [Role.ADMIN]: 'Administrador de Empresa'
};

export const ACTION_LABELS: Record<Action, string> = {
  [Action.CREATE_TENANT]: 'Crear Tenant',
  [Action.GET_ALL_TENANTS]: 'Ver todos los tenants',
  // ... etc
};

// En componentes:
<span>{{ ROLE_LABELS[user.role] }}</span>
```

### 8. **Centralizar Validaciones en Custom Validators**

```typescript
// auth.validators.ts
export const canCreateTenantValidator = (rbacService: RbacService) => {
  return (): Observable<ValidationErrors | null> => {
    return of(
      rbacService.can(Action.CREATE_TENANT) ? null : { forbiddenRole: true }
    );
  };
};

// En formularios:
form = new FormGroup({
  tenantName: new FormControl(''),
}, { validators: [canCreateTenantValidator(this.rbacService)] });
```

### 9. **Extender RBAC para Casos Específicos**

```typescript
// rbac.extended.ts - Extensiones para lógica compleja
export class RbacExtendedService {
  constructor(private rbac: RbacService) {}

  canDeleteUser(targetUser: { tenantId: string; role: Role }): boolean {
    const currentUser = this.rbac.getCurrentUser();
    if (!currentUser) return false;

    // SUPER_ADMIN puede eliminar a cualquiera
    if (currentUser.role === Role.SUPER_ADMIN) return true;

    // ADMIN puede eliminar usuarios de su tenant que no sean SUPER_ADMIN
    if (currentUser.role === Role.ADMIN &&
        currentUser.tenantId === targetUser.tenantId &&
        targetUser.role !== Role.SUPER_ADMIN) {
      return true;
    }

    return false;
  }
}
```

### 10. **Testear Permisos**

```typescript
// rbac.service.spec.ts
describe('RbacService', () => {
  let service: RbacService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RbacService]
    });
    service = TestBed.inject(RbacService);
  });

  it('should allow SUPER_ADMIN to create tenant', () => {
    const user: UserContext = {
      id: '1',
      role: Role.SUPER_ADMIN,
      tenantId: 'tenant-1',
      username: 'admin'
    };
    
    service.setCurrentUser(user);
    expect(service.can(Action.CREATE_TENANT)).toBe(true);
  });

  it('should deny ADMIN to create tenant', () => {
    const user: UserContext = {
      id: '2',
      role: Role.ADMIN,
      tenantId: 'tenant-2',
      username: 'company-admin'
    };
    
    service.setCurrentUser(user);
    expect(service.can(Action.CREATE_TENANT)).toBe(false);
  });

  it('should validate tenant access for ADMIN', () => {
    const user: UserContext = {
      id: '3',
      role: Role.ADMIN,
      tenantId: 'tenant-3',
      username: 'admin3'
    };
    
    service.setCurrentUser(user);
    expect(service.validateTenantAccess('tenant-3')).toBe(true);
    expect(service.validateTenantAccess('tenant-4')).toBe(false);
  });
});
```

---

## Ejemplos Completos

### Ejemplo 1: Dashboard Multi-Rol

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CanDirective],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <!-- Panel SUPER_ADMIN -->
      <div *ngIf="isSuperAdmin()" class="panel admin-panel">
        <h2>Administración Global</h2>
        <button *appCan="'createTenant'">Crear Tenant</button>
        <button *appCan="'getGlobalMetrics'">Ver Métricas Globales</button>
      </div>

      <!-- Panel SUPPORT -->
      <div *ngIf="isSupport()" class="panel support-panel">
        <h2>Centro de Soporte</h2>
        <button *appCan="'getAllTenants'">Ver Todos los Tenants</button>
        <button *appCan="'editUsers'">Gestionar Usuarios</button>
      </div>

      <!-- Panel ADMIN -->
      <div *ngIf="isAdmin()" class="panel admin-panel">
        <h2>Administración de Empresa</h2>
        <button *appCan="'createUsers'">Crear Usuario</button>
        <button *appCan="'getCompanyMetrics'">Ver Métricas</button>
      </div>
    </div>
  `
})
export class DashboardComponent {
  constructor(private rbac: RbacService) {}

  isSuperAdmin() { return this.rbac.isSuperAdmin(); }
  isSupport() { return this.rbac.isSupport(); }
  isAdmin() { return this.rbac.isAdmin(); }
}
```

### Ejemplo 2: Componente de Gestión de Usuarios

```typescript
@Component({
  selector: 'app-users-management',
  template: `
    <div class="users-management">
      <!-- Formulario de creación -->
      <form *appCan="'createUsers'" class="create-form">
        <input [(ngModel)]="newUser.name" placeholder="Nombre">
        <input [(ngModel)]="newUser.email" placeholder="Email">
        <select [(ngModel)]="newUser.role">
          <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
        </select>
        <button (click)="createUser()">Crear Usuario</button>
      </form>

      <!-- Tabla de usuarios -->
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button *appCan="'editUsers'" (click)="editUser(user)">
                Editar
              </button>
              <button *ngIf="canDelete(user)" (click)="deleteUser(user)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UsersManagementComponent {
  users = [...];
  newUser = { name: '', email: '', role: '' };
  roles = [...];

  constructor(private rbac: RbacService) {}

  createUser() {
    if (this.rbac.can(Action.CREATE_USERS)) {
      // crear usuario...
    }
  }

  canDelete(user: any): boolean {
    // SUPER_ADMIN puede eliminar a cualquiera
    // ADMIN solo puede eliminar usuarios de su tenant
    if (this.rbac.isSuperAdmin()) return true;
    
    if (this.rbac.isAdmin()) {
      const currentUser = this.rbac.getCurrentUser();
      return currentUser?.tenantId === user.tenantId;
    }

    return false;
  }
}
```

---

## Resumen

| Tarea | Solución |
|-------|----------|
| Verificar permiso en TypeScript | `rbacService.can(action)` |
| Verificar permiso en template | `*appCan="'actionName'"` |
| Proteger ruta | `canActivate: [RbacGuard]` + `data: { requiredRole }` |
| Obtener usuario actual | `rbacService.getCurrentUser()` |
| Suscribirse a cambios de usuario | `rbacService.currentUser$.subscribe(...)` |
| Validar acceso a tenant | `rbacService.validateTenantAccess(tenantId)` |
| Obtener permisos disponibles | `rbacService.getPermittedActions()` |
| Debuggear permisos | `rbacService.debugCurrentUserPermissions()` |

---

## Escalabilidad Futura

Para agregar nuevas acciones:

1. Agregar a `enum Action` en `rbac.types.ts`
2. Definir regla en `RBAC_PERMISSIONS` en `rbac.config.ts`
3. Actualizar `ROLE_PERMISSIONS` con matriz de permisos

Sistema totalmente extensible sin cambios en la lógica core.
