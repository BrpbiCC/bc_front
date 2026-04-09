/**
 * Routes with RBAC Protection
 * Ejemplos de cómo proteger rutas con el RBAC guard
 */

import { Routes } from '@angular/router';
import { RbacGuard, Role, Action } from '../core/rbac';
import { ExampleBasicComponent, ExampleDirectiveComponent } from '../components/rbac-examples/rbac-examples.component';

/**
 * Configuración de rutas con protección RBAC
 *
 * Opciones de data:
 * - requiredRole: Role | Role[] - Rol(es) requerido(s)
 * - requiredAction: Action - Acción/permiso requerido
 *
 * Nota: Se pueden combinar requiredRole y requiredAction
 */
export const RBAC_PROTECTED_ROUTES: Routes = [
  {
    path: 'admin',
    canActivate: [RbacGuard],
    data: { requiredRole: Role.SUPER_ADMIN },
    component: ExampleBasicComponent,
    children: [
      {
        path: 'tenants',
        canActivate: [RbacGuard],
        data: { requiredAction: Action.CREATE_TENANT },
        component: ExampleBasicComponent
      },
      {
        path: 'users',
        canActivate: [RbacGuard],
        data: { requiredRole: [Role.SUPER_ADMIN, Role.SUPPORT] },
        component: ExampleBasicComponent
      }
    ]
  },
  {
    path: 'support',
    canActivate: [RbacGuard],
    data: { requiredRole: Role.SUPPORT },
    component: ExampleDirectiveComponent
  },
  {
    path: 'company',
    canActivate: [RbacGuard],
    data: { requiredRole: Role.ADMIN },
    component: ExampleDirectiveComponent,
    children: [
      {
        path: 'metrics',
        canActivate: [RbacGuard],
        data: { requiredAction: Action.GET_COMPANY_METRICS },
        component: ExampleBasicComponent
      },
      {
        path: 'nfc',
        canActivate: [RbacGuard],
        data: { requiredAction: Action.LINK_MACHINE_WITH_NFC },
        component: ExampleBasicComponent
      }
    ]
  },
  {
    path: 'unauthorized',
    component: ExampleDirectiveComponent
  }
];

/**
 * Ejemplo de configuración en app.routes.ts:
 *
 * import { ApplicationConfig, importProvidersFrom } from '@angular/core';
 * import { provideRouter } from '@angular/router';
 * import { RBAC_PROTECTED_ROUTES } from './routes/rbac.routes';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(RBAC_PROTECTED_ROUTES),
 *     // otros providers...
 *   ]
 * };
 */
