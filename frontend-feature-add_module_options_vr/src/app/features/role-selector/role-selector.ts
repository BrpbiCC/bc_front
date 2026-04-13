import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, type UserRole } from '../../core/services/auth.service';

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="role-selector-wrapper">
      <div class="role-selector-card">
        <div class="role-selector-header">
          <h1>Seleccionar Rol</h1>
          <p>Elige tu rol para continuar</p>
        </div>

        <div class="role-options">
          <button class="role-btn admin-btn" (click)="selectRole('admin')">
            <span class="role-icon">👨‍💼</span>
            <span class="role-name">Administrador</span>
          </button>

          <button class="role-btn support-btn" (click)="selectRole('support')">
            <span class="role-icon">👨‍💻</span>
            <span class="role-name">Soporte</span>
          </button>

          <button class="role-btn super-btn" (click)="selectRole('super-admin')">
            <span class="role-icon">🛡️</span>
            <span class="role-name">Super Administrador</span>
          </button>
        </div>

        <div class="role-description">
          <p class="note">Nota: Este es un selector temporal sin autenticación para desarrollo</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .role-selector-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--surface-low) 0%, var(--surface) 100%);
      }

      .role-selector-card {
        background: var(--surface-lowest);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 3rem;
        max-width: 400px;
        width: 100%;
        box-shadow: var(--shadow-lg);
      }

      .role-selector-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .role-selector-header h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        color: var(--text-primary);
      }

      .role-selector-header p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .role-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .role-btn {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 2px solid var(--border);
        border-radius: 12px;
        background: var(--surface);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1rem;
        font-weight: 500;
      }

      .role-btn:hover {
        border-color: var(--primary);
        background: var(--hover-bg-light);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      .role-icon {
        font-size: 1.5rem;
      }

      .admin-btn:hover {
        border-color: #f26522;
      }

      .support-btn:hover {
        border-color: #3498db;
      }

      .super-btn:hover {
        border-color: #8e44ad;
      }

      .role-description {
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
      }

      .note {
        margin: 0;
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    `,
  ],
})
export class RoleSelector {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  selectRole(role: UserRole): void {
    this.authService.setRole(role);
    this.router.navigate(['/dashboard']);
  }
}
