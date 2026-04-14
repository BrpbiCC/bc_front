import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../core/services/filter.service';
import { ViewSearchFiltersComponent } from '../view-search-filters/view-search-filters.component';

export interface ActivoNFC {
  codigo: string;
  equipo: string;
  estado: string;
  ultimaRevision: string;
}

const DATOS_ACTIVOS: ActivoNFC[] = [
  {
    codigo: 'NFC-8472',
    equipo: 'Conservadora Vertical A1',
    estado: 'Operativo',
    ultimaRevision: '25 Mar 2026, 14:30',
  },
  {
    codigo: 'NFC-1933',
    equipo: 'Vitrina Exhibidora',
    estado: 'Mantenimiento',
    ultimaRevision: '24 Mar 2026, 09:15',
  },
  {
    codigo: 'NFC-2044',
    equipo: 'Cámara Frigorífica 02',
    estado: 'Alerta',
    ultimaRevision: '25 Mar 2026, 16:00',
  },
  {
    codigo: 'NFC-3311',
    equipo: 'Conservadora Horizontal B',
    estado: 'Operativo',
    ultimaRevision: '25 Mar 2026, 11:40',
  },
  {
    codigo: 'NFC-0099',
    equipo: 'Vitrina Pastelería',
    estado: 'Operativo',
    ultimaRevision: '24 Mar 2026, 17:00',
  },
];

@Component({
  selector: 'app-activos',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewSearchFiltersComponent],
  templateUrl: './activos.html',
  styleUrls: ['./activos.css'],
})
export class Activos implements OnInit {
  activeTab: 'list' | 'create' = 'list';
  isEditing = false;
  editingIndex: number | null = null;

  activos: ActivoNFC[] = DATOS_ACTIVOS;

  estados = ['Operativo', 'Mantenimiento', 'Alerta'];
  equipos = [
    'Conservadora Vertical A1',
    'Vitrina Exhibidora',
    'Cámara Frigorífica 02',
    'Conservadora Horizontal B',
    'Vitrina Pastelería',
    'Otro (especificar)'
  ];

  newActivo: ActivoNFC = {
    codigo: '',
    equipo: '',
    estado: 'Operativo',
    ultimaRevision: new Date().toLocaleString('es-ES')
  };

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('activos');
  }

  setActiveTab(tab: 'list' | 'create'): void {
    this.activeTab = tab;
  }

  generateCodigo(): string {
    const numAleatorio = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `NFC-${numAleatorio}`;
  }

  createActivo(): void {
    if (this.newActivo.codigo && this.newActivo.equipo) {
      if (this.isEditing && this.editingIndex !== null) {
        this.activos[this.editingIndex] = { ...this.newActivo };
        this.cancelEdit();
      } else {
        const activoNuevo: ActivoNFC = {
          ...this.newActivo,
          codigo: this.newActivo.codigo || this.generateCodigo(),
          ultimaRevision: new Date().toLocaleString('es-ES')
        };
        this.activos.push(activoNuevo);
        this.resetForm();
      }
      this.activeTab = 'list';
    }
  }

  editActivo(index: number): void {
    this.newActivo = { ...this.activos[index] };
    this.isEditing = true;
    this.editingIndex = index;
    this.activeTab = 'create';
  }

  deleteActivo(index: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este activo NFC? Esta acción no puede deshacerse.')) {
      this.activos.splice(index, 1);
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingIndex = null;
  }

  resetForm(): void {
    this.newActivo = {
      codigo: '',
      equipo: '',
      estado: 'Operativo',
      ultimaRevision: new Date().toLocaleString('es-ES')
    };
  }

  generateCodigoAuto(): void {
    this.newActivo.codigo = this.generateCodigo();
  }
}
