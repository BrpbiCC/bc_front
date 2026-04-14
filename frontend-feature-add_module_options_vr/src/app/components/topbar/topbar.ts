import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TopbarMobile } from '../topbar-mobile/topbar-mobile';
import { AuthService, type UserRole } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective, TopbarMobile, RouterModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css'],
})
export class Topbar implements OnInit, OnDestroy {
  showNotifications = false;
  showUserDropdown = false;
  showMobileMenu = false;

  notifications: Notification[] = [];
  isDarkTheme = false;
  userName = 'Usuario';
  userRoleLabel = 'Invitado';
  userInitials = 'US';

  private subscriptions = new Subscription();

  private readonly roleLabels: Record<UserRole, string> = {
    admin: 'Administrador',
    support: 'Soporte',
    'super-admin': 'Super Administrador',
  };

  private readonly roleFallbackNames: Record<UserRole, string> = {
    admin: 'Administrador Principal',
    support: 'Soporte Tecnico',
    'super-admin': 'Administrador Global',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.notifications = [
      { id: 1, title: 'Ticket #1247 asignado', message: 'Se le ha asignado un nuevo ticket de mantención', time: 'Hace 5 min', type: 'alert', read: false },
      { id: 2, title: 'Visita completada', message: 'La visita al local #432 fue marcada como completada', time: 'Hace 1 hora', type: 'success', read: false },
      { id: 3, title: 'Sistema actualizado', message: 'El sistema ha sido actualizado a la versión 2.1', time: 'Hace 3 horas', type: 'info', read: true },
    ];

    this.loadSavedTheme();
    this.refreshUserInfo(this.authService.getRole());
    this.subscriptions.add(
      this.authService.role$.subscribe((role) => {
        this.refreshUserInfo(role);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserDropdown = false;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) {
      this.showNotifications = false;
    }
  }

  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  markAllRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  logout() {
    this.showUserDropdown = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  private refreshUserInfo(role: UserRole | null): void {
    const displayRole = role ? this.roleLabels[role] : 'Invitado';
    const storedName = this.getStoredUserName();
    const fallbackName = role ? this.roleFallbackNames[role] : 'Usuario';

    this.userName = storedName || fallbackName;
    this.userRoleLabel = displayRole;
    this.userInitials = this.buildInitials(this.userName);
  }

  private getStoredUserName(): string {
    const keys = ['userName', 'username', 'displayName', 'fullName', 'nombre'];
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value && value.trim()) {
        return value.trim();
      }
    }
    return '';
  }

  private buildInitials(name: string): string {
    const parts = name
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      return 'US';
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
}