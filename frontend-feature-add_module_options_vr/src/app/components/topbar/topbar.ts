import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TopbarMobile } from '../topbar-mobile/topbar-mobile';

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
export class Topbar implements OnInit {
  showNotifications = false;
  showUserDropdown = false;
  showMobileMenu = false;

  notifications: Notification[] = [];
  isDarkTheme = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notifications = [
      { id: 1, title: 'Ticket #1247 asignado', message: 'Se le ha asignado un nuevo ticket de mantención', time: 'Hace 5 min', type: 'alert', read: false },
      { id: 2, title: 'Visita completada', message: 'La visita al local #432 fue marcada como completada', time: 'Hace 1 hora', type: 'success', read: false },
      { id: 3, title: 'Sistema actualizado', message: 'El sistema ha sido actualizado a la versión 2.1', time: 'Hace 3 horas', type: 'info', read: true },
    ];

    this.loadSavedTheme();
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
}