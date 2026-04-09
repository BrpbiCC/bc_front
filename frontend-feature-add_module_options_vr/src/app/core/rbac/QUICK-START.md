/**
 * QUICK START - Sistema RBAC
 * Guía de inicio rápido para implementar RBAC en tu aplicación
 */

// ============================================
// PASO 1: Verificar la estructura creada
// ============================================

/*
Archivos creados en: src/app/core/rbac/

✅ rbac.types.ts              - Tipos e interfaces
✅ rbac.config.ts             - Configuración de permisos
✅ rbac.service.ts            - Servicio principal
✅ rbac.guard.ts              - Route guard
✅ can.directive.ts           - Directiva *appCan
✅ index.ts                   - Exportaciones
✅ rbac.service.spec.ts       - Tests
✅ README.md                  - Documentación
✅ RBAC-GUIDE.md              - Guía completa

Ejemplos creados en: src/app/components/

✅ rbac-examples.component.ts - Ejemplos de uso
✅ tenant-management.component.ts - Ejemplo completo integrado

Configuración en: src/app/routes/

✅ rbac.routes.ts             - Rutas protegidas
*/

// ============================================
// PASO 2: Importar el Servicio en app.ts
// ============================================

import { RbacService } from './core/rbac';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [/* ... */],
})
export class AppComponent implements OnInit {
  constructor(private rbacService: RbacService) {}

  ngOnInit() {
    // Cuando el usuario inicia sesión:
    const user = {
      id: 'user123',
      role: 'ADMIN',
      tenantId: 'company-456',
      username: 'juan.perez'
    };
    
    this.rbacService.setCurrentUser(user);
    // Ya está disponible en toda la aplicación
  }
}

// ============================================
// PASO 3: Usar en Componentes
// ============================================

// Opción A: Verificar en TypeScript
import { RbacService, Action } from '../../core/rbac';

@Component({})
export class MyComponent {
  constructor(private rbac: RbacService) {}

  someMethod() {
    if (this.rbac.can(Action.CREATE_USERS)) {
      // Permitir acción
    }
  }
}

// Opción B: Usar directiva en template
import { CanDirective } from '../../core/rbac';

@Component({
  imports: [CanDirective],
  template: `
    <button *appCan="'createUsers'">Crear Usuario</button>
  `
})
export class MyComponent {}

// ============================================
// PASO 4: Proteger Rutas
// ============================================

import { RbacGuard, Role, Action } from './core/rbac';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [RbacGuard],
    data: { requiredRole: Role.SUPER_ADMIN },
    component: AdminComponent
  }
];

// ============================================
// PASO 5: Logout
// ============================================

logout() {
  this.rbacService.clearCurrentUser();
  // Usuario desautenticado
}

// ============================================
// CHEAT SHEET - Métodos Más Usados
// ============================================

/*
✓ Verificar permiso:
  rbacService.can(Action.CREATE_USERS, 'tenant-id')

✓ Verificar rol:
  rbacService.isSuperAdmin()
  rbacService.isSupport()
  rbacService.isAdmin()
  rbacService.hasRole(Role.SUPER_ADMIN, Role.SUPPORT)

✓ Obtener usuario:
  rbacService.getCurrentUser()
  rbacService.getCurrentUser$() // Observable

✓ Obtener permisos:
  rbacService.getPermittedActions()
  rbacService.getPermittedActionsForRole(Role.ADMIN)

✓ Validar tenant:
  rbacService.validateTenantAccess('tenant-id')

✓ Establecer usuario:
  rbacService.setCurrentUser(userContext)

✓ Limpiar usuario:
  rbacService.clearCurrentUser()

✓ Debugging:
  rbacService.debugCurrentUserPermissions()
*/

// ============================================
// TEMPLATE CHEAT SHEET
// ============================================

/*
<!-- Mostrar si tiene permiso -->
<button *appCan="'createUsers'">Crear</button>

<!-- Con tenantId -->
<button *appCan="'linkMachineWithNFC'; appCanTenant: tenantId">
  Vincular
</button>

<!-- Verificar rol -->
<div *ngIf="rbac.isSuperAdmin()">Panel Admin</div>

<!-- Condicional con TypeScript -->
<button *ngIf="rbac.can('createTenant')">Crear Tenant</button>
*/

// ============================================
// MATRIZ DE PERMISOS
// ============================================

/*
┌─────────────────────┬──────────┬─────────┬────────┐
│ Acción              │ SUPER_AD │ SUPPORT │ ADMIN  │
├─────────────────────┼──────────┼─────────┼────────┤
│ createTenant        │    ✓     │    ✗    │   ✗    │
│ getAllTenants       │    ✓     │    ✓    │   ✗    │
│ getOwnTenant        │    ✓     │    ✓    │   ✓    │
│ createUsers         │    ✓*    │    ✗    │   ✓*   │
│ editUsers           │    ✓*    │    ✓*   │   ✓*   │
│ getGlobalMetrics    │    ✓     │    ✓    │   ✗    │
│ getCompanyMetrics   │    ✓*    │    ✓*   │   ✓*   │
│ linkMachineWithNFC  │    ✓*    │    ✗    │   ✓*   │
│ linkMachineToCustom │    ✓*    │    ✓*   │   ✓*   │
└─────────────────────┴──────────┴─────────┴────────┘

* = Requiere validación de tenantId
*/

// ============================================
// TESTING
// ============================================

describe('Mis Permisos', () => {
  let rbac: RbacService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RbacService] });
    rbac = TestBed.inject(RbacService);
  });

  it('should disable admin from creating tenant', () => {
    rbac.setCurrentUser({
      id: '1',
      role: 'ADMIN',
      tenantId: 'tenant-1',
      username: 'admin'
    });

    expect(rbac.can('createTenant')).toBe(false);
  });
});

// ============================================
// ARQUITECTURA RECOMENDADA
// ============================================

/*
src/app/
├── core/
│   ├── rbac/
│   │   ├── rbac.types.ts
│   │   ├── rbac.config.ts
│   │   ├── rbac.service.ts
│   │   ├── rbac.guard.ts
│   │   ├── can.directive.ts
│   │   ├── index.ts
│   │   └── README.md
│   ├── services/
│   │   ├── auth.service.ts    ← Configure el usuario aquí
│   │   └── api.service.ts
│   └── guards/
│       └── auth.guard.ts      ← Check si usuario existe
├── routes/
│   └── rbac.routes.ts         ← Rutas con RbacGuard
├── components/
│   ├── dashboard/
│   ├── admin/
│   └── (tus componentes)
└── app.ts
*/

// ============================================
// FLUJO RECOMENDADO
// ============================================

/*
1. Usuario inicia sesión
   ↓
2. AuthService valida credenciales con backend
   ↓
3. Backend retorna UserContext { id, role, tenantId, username }
   ↓
4. RbacService.setCurrentUser(userContext) en AuthService
   ↓
5. Router permite/deniega acceso según RbacGuard
   ↓
6. Componentes usan rbacService.can() para mostrar/ocultar UI
   ↓
7. API calls con validación backend
   ↓
8. Logout: RbacService.clearCurrentUser()
*/

// ============================================
// INTEGRACIÓN CON AUTH SERVICE
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RbacService, UserContext } from '../rbac';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private rbac: RbacService
  ) {}

  login(username: string, password: string) {
    return this.http.post<any>('/api/auth/login', { username, password })
      .pipe(
        tap(response => {
          const userContext: UserContext = {
            id: response.userId,
            role: response.role,
            tenantId: response.tenantId,
            username: response.username
          };
          this.rbac.setCurrentUser(userContext);
        })
      );
  }

  logout() {
    this.rbac.clearCurrentUser();
    // Limpiar otras cosas (tokens, etc.)
  }
}

// ============================================
// ERRORES COMUNES
// ============================================

/*
❌ ERROR 1: Olvidar importar CanDirective
export class MyComponent {
  // ❌ *appCan no funcionará
  template: `<button *appCan="'createUsers'">...</button>`
}

✅ SOLUCIÓN:
import { CanDirective } from '../../core/rbac';

@Component({
  imports: [CanDirective],  // ✅ Importar aquí
  template: `...`
})
export class MyComponent {}


❌ ERROR 2: Confiar solo en frontend
if (rbac.can(Action.DELETE_TENANT)) {
  api.deleteTenant(id); // ✅ Backend TAMBIÉN debe validar
}

✅ SOLUCIÓN:
- Validar en frontend para UX
- Validar en backend para seguridad
- El backend es la fuente de verdad


❌ ERROR 3: No limpiar usuario al logout
logout() {
  // ❌ Usuario aún visible en toda la app
}

✅ SOLUCIÓN:
logout() {
  this.rbac.clearCurrentUser();  // ✅ Obligatorio
  this.router.navigate(['/login']);
}


❌ ERROR 4: No usar tenantId en validaciones
can(Action.CREATE_USERS)  // ✅ Pero qué tenant?

✅ SOLUCIÓN:
can(Action.CREATE_USERS, userTenantId)  // ✅ Enviar contexto
*/

// ============================================
// MÁS DOCUMENTACIÓN
// ============================================

/*
📖 README.md              - Visión general
📖 RBAC-GUIDE.md          - Guía completamente detallada
📖 rbac.service.spec.ts   - Tests como ejemplos
📖 tenant-management.component.ts - Ejemplo integrado
*/

// ============================================
// PRÓXIMOS PASOS
// ============================================

/*
1. ✅ Revisar archivos creados
2. ✅ Entender la matriz de permisos
3. ✅ Integrar con AuthService
4. ✅ Proteger rutas principales
5. ✅ Usar *appCan en templates
6. ✅ Testear casos de acceso denegado
7. ✅ Documentar permisos custom si existen
8. ✅ Validar SIEMPRE en backend también
*/

console.log('🔐 Sistema RBAC listo para usar');
console.log('📖 Consulta README.md para documentación completa');
