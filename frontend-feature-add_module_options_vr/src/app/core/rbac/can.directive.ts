/**
 * RBAC Directive
 * Directiva *appCan para mostrar/ocultar elementos basándose en permisos
 * Uso: <button *appCan="'createTenant'">Crear Tenant</button>
 */

import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RbacService } from './rbac.service';
import { Action } from './rbac.types';

@Directive({
  selector: '[appCan]',
  standalone: true
})
export class CanDirective implements OnInit, OnDestroy {
  private action: Action | string | null = null;
  private tenantId: string | null = null;
  private destroy$ = new Subject<void>();
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private rbacService: RbacService
  ) {}

  /**
   * Establece la acción a verificar
   * @param action - La acción/permiso a verificar (string o Action enum)
   */
  @Input()
  set appCan(action: Action | string) {
    this.action = action;
    this.updateView();
  }

  /**
   * Establece el tenantId opcional
   * @param tenantId - ID del tenant
   */
  @Input()
  set appCanTenant(tenantId: string) {
    this.tenantId = tenantId;
    this.updateView();
  }

  ngOnInit(): void {
    // Suscribirse a cambios del usuario para actualizar la vista
    this.rbacService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    if (!this.action) {
      return;
    }

    const hasPermission = this.rbacService.can(this.action as Action, this.tenantId || undefined);

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
