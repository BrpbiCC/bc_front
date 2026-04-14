import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, type UserRole } from '../../core/services/auth.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

@Component({
  selector: 'app-topbar-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar-mobile.html',
  styleUrls: ['./topbar-mobile.css'],
})
export class TopbarMobile implements OnInit, OnDestroy {
  @Output() closeMenu = new EventEmitter<void>();

  showNotifications = false;
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
    support: 'Soporte Técnico',
    'super-admin': 'Administrador Global',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  notifications: Notification[] = [
    {
      id: 1,
      title: 'Alerta de temperatura',
      message: 'El local "Supermercado Central" supera los 8°C',
      time: 'Hace 5 minutos',
      type: 'alert',
      read: false,
    },
    {
      id: 2,
      title: 'Ticket resuelto',
      message: 'El ticket #1234 ha sido resuelto',
      time: 'Hace 1 hora',
      type: 'success',
      read: false,
    },
    {
      id: 3,
      title: 'Nueva visita programada',
      message: 'Se programó visita para mañana a las 10:00',
      time: 'Hace 2 horas',
      type: 'info',
      read: true,
    },
  ];

  ngOnInit(): void {
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

  onClose(): void {
    this.closeMenu.emit();
  }

  logout(): void {
    this.authService.logout();
    this.onClose();
    this.router.navigate(['/login']);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAllRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
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