/**
 * Ejemplo Integrado Completo: Componente de Gestión de Tenants
 * Demuestra todas las funcionalidades del RBAC en un componente real
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  RbacService,
  Action,
  Role,
  UserContext,
  CanDirective
} from '../../core/rbac';

interface Tenant {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

@Component({
  selector: 'app-tenants-management',
  standalone: true,
  imports: [CommonModule, FormsModule, CanDirective],
  template: `
    <!-- Header con información del usuario -->
    <div class="header" [ngSwitch]="true">
      <div *ngIf="(currentUser$ | async) as user" class="user-info">
        <h1>Gestión de Tenants</h1>
        <p class="user-badge">
          <span class="status-badge" [class]="(user.role || '').toLowerCase()">
            {{ user.role }}
          </span>
          {{ user.username }}
        </p>
      </div>
      <button (click)="logout()" class="btn btn-logout">Cerrar Sesión</button>
    </div>

    <!-- Mensajes de estado -->
    <div *ngIf="message" class="alert" [class.alert-success]="!error" [class.alert-error]="error">
      {{ message }}
    </div>

    <!-- Tab Navigation -->
    <div class="tabs">
      <button
        *appCan="'getAllTenants'"
        class="tab-button"
        [class.active]="activeTab === 'list'">
        Ver Todos los Tenants
      </button>
      <button
        *appCan="'createTenant'"
        class="tab-button"
        [class.active]="activeTab === 'create'">
        Crear Tenant
      </button>
      <ng-container *ngIf="!isSuperAdmin()">
        <button
          *appCan="'getOwnTenant'"
          class="tab-button"
          [class.active]="activeTab === 'own'">
          Mi Tenant
        </button>
      </ng-container>
    </div>

    <!-- Pestaña: Ver Todos los Tenants (SUPER_ADMIN y SUPPORT) -->
    <div class="tab-content" *ngIf="activeTab === 'list' && (can('getAllTenants') || can('getOwnTenant'))">
      <h2>Lista de Tenants</h2>

      <!-- Resumen -->
      <div class="summary">
        <p>Total de tenants: <strong>{{ tenants.length }}</strong></p>
      </div>

      <!-- Tabla de tenants -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tenant of filteredTenants">
              <td><strong>{{ tenant.name }}</strong></td>
              <td>{{ tenant.email }}</td>
              <td>{{ tenant.createdAt | date: 'short' }}</td>
              <td class="actions">
                <button *ngIf="can('createTenant')" class="btn-action btn-edit" (click)="editTenant(tenant)" title="Editar">
                  ✏️
                </button>
                <button *ngIf="can('createTenant')" class="btn-action btn-delete" (click)="deleteTenant(tenant)" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Información para SUPPORT -->
      <div *ngIf="isSupport()" class="info-box">
        <p>
          <strong>ℹ️ Tip:</strong> Como SUPPORT, tienes acceso a vista de todos los tenants
          para propósitos de soporte técnico. No puedes crear ni editar tenants.
        </p>
      </div>
    </div>

    <!-- Pestaña: Crear Tenant (solo SUPER_ADMIN) -->
    <div class="tab-content" *ngIf="activeTab === 'create' && can('createTenant')">
      <h2>Crear Nuevo Tenant</h2>

      <form class="form" (ngSubmit)="createTenant()">
        <div class="form-group">
          <label for="name">Nombre del Tenant *</label>
          <input
            type="text"
            id="name"
            [(ngModel)]="newTenant.name"
            name="name"
            placeholder="Nombre de la empresa"
            required>
        </div>

        <div class="form-group">
          <label for="email">Email de Contacto *</label>
          <input
            type="email"
            id="email"
            [(ngModel)]="newTenant.email"
            name="email"
            placeholder="contacto@empresa.com"
            required>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            Crear Tenant
          </button>
          <button type="button" class="btn btn-secondary" (click)="resetForm()">
            Cancelar
          </button>
        </div>
      </form>

      <!-- Información para SUPER_ADMIN -->
      <div class="info-box">
        <p>
          <strong>🔐 Solo SUPER_ADMIN:</strong> Puedes crear nuevos tenants.
          Cada tenant es una instancia aislada de la aplicación.
        </p>
      </div>
    </div>

    <!-- Pestaña: Mi Tenant (ADMIN) -->
    <div class="tab-content" *ngIf="activeTab === 'own' && can('getOwnTenant') && isAdmin()">
      <h2>Mi Tenant</h2>

      <div *ngIf="ownTenant" class="tenant-card">
        <div class="tenant-detail">
          <h3>{{ ownTenant.name }}</h3>
          <p><strong>ID:</strong> {{ ownTenant.id }}</p>
          <p><strong>Email:</strong> {{ ownTenant.email }}</p>
          <p><strong>Creado:</strong> {{ ownTenant.createdAt | date: 'long' }}</p>
        </div>

        <!-- Botones de acción solo si tiene permisos -->
        <div class="tenant-actions" *ngIf="can('createTenant')">
          <button class="btn btn-secondary" (click)="editTenant(ownTenant!)">
            Editar Información
          </button>
        </div>
      </div>

      <!-- Información para ADMIN -->
      <div class="info-box">
        <p>
          <strong>📋 Como ADMIN:</strong> Solo tienes acceso a tu tenant.
          No puedes ver o acceder a otros tenants.
        </p>
      </div>
    </div>

    <!-- Panel de Información de Permisos -->
    <div class="permissions-panel">
      <h3>Tus Permisos</h3>
      <div class="permissions-list">
        <div class="permission-item" *ngFor="let action of availableActions">
          <span class="check">✓</span>
          <span>{{ formatActionName(action) }}</span>
        </div>
        <p *ngIf="availableActions.length === 0" class="no-permissions">
          No tienes permisos para ninguna acción
        </p>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .user-info h1 {
      margin: 0;
      font-size: 24px;
    }

    .user-badge {
      margin: 10px 0 0 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.3);
      color: white;
    }

    .status-badge.super_admin {
      background: #e74c3c;
    }

    .status-badge.support {
      background: #3498db;
    }

    .status-badge.admin {
      background: #f39c12;
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .btn-logout:hover {
      background: white;
      color: #667eea;
    }

    .alert {
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      border-left: 4px solid;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border-left-color: #28a745;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border-left-color: #f5c6cb;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }

    .tab-button {
      padding: 12px 20px;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      transition: all 0.3s ease;
    }

    .tab-button:hover {
      color: #333;
    }

    .tab-button.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .summary {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .table-container {
      overflow-x: auto;
      margin: 15px 0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .data-table th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
    }

    .data-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-action {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 5px 10px;
      border-radius: 4px;
    }

    .btn-action:hover {
      background: #f0f0f0;
    }

    .form {
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
    }

    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .info-box {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }

    .tenant-card {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .tenant-detail h3 {
      margin-top: 0;
    }

    .tenant-detail p {
      margin: 10px 0;
      color: #666;
    }

    .tenant-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
    }

    .permissions-panel {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .permissions-panel h3 {
      margin-top: 0;
      color: #667eea;
    }

    .permissions-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 10px;
    }

    .permission-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .check {
      color: #28a745;
      font-weight: bold;
    }

    .no-permissions {
      color: #999;
      font-style: italic;
    }
  `]
})
export class TenantManagementComponent implements OnInit, OnDestroy {
  activeTab: 'list' | 'create' | 'own' = 'list';
  currentUser$: Observable<UserContext | null>;
  
  tenants: Tenant[] = [
    { id: '1', name: 'Empresa A', email: 'admin@empresaa.com', createdAt: '2024-01-15' },
    { id: '2', name: 'Empresa B', email: 'admin@empresab.com', createdAt: '2024-02-20' },
    { id: '3', name: 'Empresa C', email: 'admin@empresac.com', createdAt: '2024-03-10' }
  ];

  ownTenant: Tenant | null = null;
  filteredTenants: Tenant[] = [];
  
  newTenant = { name: '', email: '' };
  availableActions: Action[] = [];
  
  message = '';
  error = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private rbacService: RbacService,
    private router: Router
  ) {
    this.currentUser$ = this.rbacService.getCurrentUser$();
  }

  ngOnInit(): void {
    this.loadPermissions();
    this.updateFilteredTenants();
    
    // Suscribirse a cambios del usuario
    this.rbacService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPermissions();
        this.updateFilteredTenants();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPermissions(): void {
    this.availableActions = this.rbacService.getPermittedActions();
  }

  updateFilteredTenants(): void {
    const user = this.rbacService.getCurrentUser();

    if (!user) return;

    // SUPER_ADMIN y SUPPORT ven todos
    if (user.role === Role.SUPER_ADMIN || user.role === Role.SUPPORT) {
      this.filteredTenants = this.tenants;
    } else {
      // ADMIN solo ve su tenant
      this.filteredTenants = this.tenants.filter(t => t.id === user.tenantId);
      this.ownTenant = this.filteredTenants[0] || null;
    }
  }

  can(action: string): boolean {
    return this.rbacService.can(action as Action);
  }

  isSuperAdmin(): boolean {
    return this.rbacService.isSuperAdmin();
  }

  isSupport(): boolean {
    return this.rbacService.isSupport();
  }

  isAdmin(): boolean {
    return this.rbacService.isAdmin();
  }

  createTenant(): void {
    if (!this.rbacService.can(Action.CREATE_TENANT)) {
      this.showError('No tienes permiso para crear tenants');
      return;
    }

    if (!this.newTenant.name || !this.newTenant.email) {
      this.showError('Completa todos los campos');
      return;
    }

    const tenant: Tenant = {
      id: Date.now().toString(),
      name: this.newTenant.name,
      email: this.newTenant.email,
      createdAt: new Date().toISOString()
    };

    this.tenants.push(tenant);
    this.resetForm();
    this.showSuccess('Tenant creado exitosamente');
  }

  editTenant(tenant: Tenant): void {
    if (!this.rbacService.can(Action.CREATE_TENANT)) {
      this.showError('No tienes permiso para editar tenants');
      return;
    }

    console.log('Editar tenant:', tenant);
    this.showSuccess('Funcionalidad de edición en desarrollo');
  }

  deleteTenant(tenant: Tenant): void {
    if (!this.rbacService.can(Action.CREATE_TENANT)) {
      this.showError('No tienes permiso para eliminar tenants');
      return;
    }

    if (confirm(`¿Eliminar tenant "${tenant.name}"?`)) {
      this.tenants = this.tenants.filter(t => t.id !== tenant.id);
      this.updateFilteredTenants();
      this.showSuccess('Tenant eliminado');
    }
  }

  resetForm(): void {
    this.newTenant = { name: '', email: '' };
  }

  logout(): void {
    this.rbacService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  formatActionName(action: Action): string {
    return action
      .replace(/([A-Z])/g, ' $1')
      .toUpperCase()
      .trim();
  }

  private showSuccess(msg: string): void {
    this.message = msg;
    this.error = false;
    setTimeout(() => this.message = '', 3000);
  }

  private showError(msg: string): void {
    this.message = msg;
    this.error = true;
    setTimeout(() => this.message = '', 3000);
  }
}
