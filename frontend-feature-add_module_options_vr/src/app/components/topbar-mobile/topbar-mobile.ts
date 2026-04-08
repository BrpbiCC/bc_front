import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class TopbarMobile implements OnInit {
  @Output() closeMenu = new EventEmitter<void>();

  showNotifications = false;

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

  ngOnInit(): void {}

  onClose(): void {
    this.closeMenu.emit();
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
}