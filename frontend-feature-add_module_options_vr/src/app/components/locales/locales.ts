import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../core/services/filter.service';

interface Local {
  id: string;
  nombre: string;
  direccion: string;
  encargado: string;
  equiposNFC: number;
  status: 'online' | 'offline';
}

@Component({
  selector: 'app-locales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locales.html',
  styleUrls: ['./locales.css']
})
export class Locales implements OnInit {
  activeTab = 'list';
  locales: Local[] = [
    {
      id: 'LOC-001',
      nombre: 'Bodegón El Sol',
      direccion: 'Av. Libertador 45, Este',
      encargado: 'Roberto Díaz',
      equiposNFC: 12,
      status: 'online'
    },
    {
      id: 'LOC-002',
      nombre: 'Supermercado Norte',
      direccion: 'Zona Industrial II, Galpón 4',
      encargado: 'Carmen Silva',
      equiposNFC: 8,
      status: 'offline'
    },
    {
      id: 'LOC-003',
      nombre: 'Minimarket Central',
      direccion: 'Calle Merced 102, Piso 1',
      encargado: 'Juan Torres',
      equiposNFC: 5,
      status: 'online'
    }
  ];

  newLocal: Partial<Local> = {
    nombre: '',
    direccion: '',
    encargado: '',
    equiposNFC: 0
  };

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('locales');
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  createLocal(): void {
    if (!this.newLocal.nombre || !this.newLocal.direccion || !this.newLocal.encargado) {
      return;
    }

    const id = this.generateLocalId();
    const local: Local = {
      id,
      nombre: this.newLocal.nombre,
      direccion: this.newLocal.direccion,
      encargado: this.newLocal.encargado,
      equiposNFC: this.newLocal.equiposNFC || 0,
      status: 'offline'
    };

    this.locales.unshift(local);
    this.resetForm();
    this.setActiveTab('list');
  }

  private generateLocalId(): string {
    const maxId = this.locales
      .map(l => parseInt(l.id.split('-')[1]))
      .reduce((max, num) => Math.max(max, num), 0);
    return `LOC-${String(maxId + 1).padStart(3, '0')}`;
  }

  private resetForm(): void {
    this.newLocal = {
      nombre: '',
      direccion: '',
      encargado: '',
      equiposNFC: 0
    };
  }
}
