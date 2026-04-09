/**
 * RBAC Usage Examples
 * Ejemplos de cómo usar el sistema RBAC en componentes
 */

import { Component, OnInit } from '@angular/core';
import { RbacService, Action, Role, UserContext, CanDirective } from '../../core/rbac';
import { CommonModule } from '@angular/common';

/**
 * EJEMPLO 1: Componente básico con verificación de permisos en TypeScript
 */
@Component({
  selector: 'app-example-basic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example-container">
      <h2>Ejemplo 1: Verificación Básica</h2>

      <!-- Botón visible solo si el usuario puede crear tenants -->
      <button
        *ngIf="canCreateTenant()"
        class="btn btn-primary"
        (click)="createTenant()">
        Crear Nuevo Tenant
      </button>

      <!-- Mostrar información del usuario -->
      <div class="user-info" *ngIf="currentUser$ | async as user">
        <p><strong>Usuario:</strong> {{ user.username }}</p>
        <p><strong>Rol:</strong> {{ user.role }}</p>
        <p><strong>Tenant ID:</strong> {{ user.tenantId }}</p>
      </div>

      <!-- Mostrar todas las acciones permitidas -->
      <div class="permissions-list">
        <h3>Permisos disponibles:</h3>
        <ul>
          <li *ngFor="let action of permittedActions">✓ {{ action }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      border: 1px solid #ddd;
      margin: 10px 0;
      border-radius: 4px;
    }

    .user-info {
      margin: 15px 0;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .permissions-list {
      margin-top: 15px;
    }

    .permissions-list ul {
      list-style: none;
      padding: 0;
    }

    .permissions-list li {
      padding: 5px 0;
      color: #27ae60;
    }

    .btn {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }
  `]
})
export class ExampleBasicComponent implements OnInit {
  currentUser$ = this.rbacService.getCurrentUser$();
  permittedActions: Action[] = [];

  constructor(private rbacService: RbacService) {}

  ngOnInit(): void {
    this.permittedActions = this.rbacService.getPermittedActions();
  }

  canCreateTenant(): boolean {
    return this.rbacService.can(Action.CREATE_TENANT);
  }

  createTenant(): void {
    console.log('Crear tenant...');
  }
}

/**
 * EJEMPLO 2: Componente con directiva *appCan
 */
@Component({
  selector: 'app-example-directive',
  standalone: true,
  imports: [CommonModule, CanDirective],
  template: `
    <div class="example-container">
      <h2>Ejemplo 2: Usando Directiva *appCan</h2>

      <!-- Botones visibles solo si el usuario tiene el permiso -->
      <div class="button-group">
        <button *appCan="'createTenant'" class="btn btn-primary">
          Crear Tenant
        </button>

        <button *appCan="'getAllTenants'" class="btn btn-primary">
          Ver Todos los Tenants
        </button>

        <button *appCan="'createUsers'" class="btn btn-success">
          Crear Usuario
        </button>

        <button *appCan="'linkMachineWithNFC'" class="btn btn-warning">
          Vincular Máquina con NFC
        </button>

        <button *appCan="'getGlobalMetrics'" class="btn btn-info">
          Ver Métricas Globales
        </button>
      </div>

      <!-- Panel solo visible para SUPER_ADMIN -->
      <div *ngIf="isSuperAdmin()" class="admin-panel">
        <h3>🔐 Panel de Administrador</h3>
        <p>Contenido exclusivo para SUPER_ADMIN</p>
      </div>

      <!-- Opciones para SUPPORT -->
      <div *ngIf="isSupport()" class="support-panel">
        <h3>👥 Centro de Soporte</h3>
        <ul>
          <li><a href="#">Ver todos los tenants</a></li>
          <li><a href="#">Editar usuarios</a></li>
          <li><a href="#">Ver métricas globales</a></li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      border: 1px solid #ddd;
      margin: 10px 0;
      border-radius: 4px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 15px 0;
    }

    .btn {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: white;
    }

    .btn-primary {
      background: #3498db;
    }

    .btn-success {
      background: #27ae60;
    }

    .btn-warning {
      background: #f39c12;
    }

    .btn-info {
      background: #16a085;
    }

    .admin-panel,
    .support-panel {
      margin-top: 20px;
      padding: 15px;
      border-left: 4px solid #e74c3c;
      background: #fdf2f2;
    }

    .support-panel {
      border-left-color: #3498db;
      background: #f0f8ff;
    }

    .support-panel ul {
      list-style: none;
      padding: 0;
      margin: 10px 0 0 0;
    }

    .support-panel li {
      padding: 8px 0;
    }

    .support-panel a {
      color: #3498db;
      text-decoration: none;
    }

    .support-panel a:hover {
      text-decoration: underline;
    }
  `]
})
export class ExampleDirectiveComponent {
  constructor(private rbacService: RbacService) {}

  isSuperAdmin(): boolean {
    return this.rbacService.isSuperAdmin();
  }

  isSupport(): boolean {
    return this.rbacService.isSupport();
  }
}

/**
 * EJEMPLO 3: Gestión de Usuarios con Control de Acceso
 */
@Component({
  selector: 'app-example-users-management',
  standalone: true,
  imports: [CommonModule, CanDirective],
  template: `
    <div class="example-container">
      <h2>Ejemplo 3: Gestión de Usuarios con RBAC</h2>

      <div class="form-section" *appCan="'createUsers'">
        <h3>Crear Nuevo Usuario</h3>
        <div class="form-group">
          <label>Nombre:</label>
          <input type="text" placeholder="Ingrese nombre de usuario">
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" placeholder="Ingrese email">
        </div>
        <button class="btn btn-primary">Crear Usuario</button>
      </div>

      <div class="users-table-section">
        <h3>Lista de Usuarios</h3>
        <table class="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <!-- Botón EDITAR -->
                <button
                  *appCan="'editUsers'"
                  class="btn-action btn-edit"
                  title="Editar usuario">
                  ✏️
                </button>

                <!-- Botón ELIMINAR (solo para SUPER_ADMIN) -->
                <button
                  *ngIf="isSuperAdmin()"
                  class="btn-action btn-delete"
                  title="Eliminar usuario">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      border: 1px solid #ddd;
      margin: 10px 0;
      border-radius: 4px;
    }

    .form-section {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .form-group {
      margin: 10px 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .btn {
      padding: 10px 15px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .users-table th,
    .users-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }

    .users-table th {
      background: #f5f5f5;
      font-weight: bold;
    }

    .btn-action {
      margin: 0 5px;
      padding: 5px 10px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 16px;
    }

    .btn-edit:hover {
      opacity: 0.7;
    }

    .btn-delete {
      color: #e74c3c;
    }
  `]
})
export class ExampleUsersManagementComponent implements OnInit {
  users = [
    { name: 'Carlos Mendoza', email: 'carlos@example.com', role: 'Técnico' },
    { name: 'Luis Araya', email: 'luis@example.com', role: 'Técnico' },
    { name: 'Admin Sistema', email: 'admin@example.com', role: 'Administrador' }
  ];

  constructor(private rbacService: RbacService) {}

  ngOnInit(): void {
    this.rbacService.debugCurrentUserPermissions();
  }

  isSuperAdmin(): boolean {
    return this.rbacService.isSuperAdmin();
  }
}
