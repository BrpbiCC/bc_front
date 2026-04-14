import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../core/services/filter.service';
import { ViewSearchFiltersComponent } from '../view-search-filters/view-search-filters.component';

interface Visita {
  tiempo: string;
  dia: string;
  titulo: string;
  local: string;
  tecnico: string;
  estado: 'Pendiente' | 'Completada' | 'Programada';
}

@Component({
  selector: 'app-visitas',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewSearchFiltersComponent],
  templateUrl: './visitas.html',
  styleUrls: ['./visitas.css'],
})
export class Visitas implements OnInit {
  activeTab: 'list' | 'create' = 'list';
  isEditing = false;
  editingIndex: number | null = null;

  visitas: Visita[] = [
    {
      tiempo: '09:00',
      dia: 'Hoy',
      titulo: 'Mantenimiento Preventivo',
      local: 'Bodegón El Sol',
      tecnico: 'Carlos M.',
      estado: 'Pendiente'
    },
    {
      tiempo: '07:30',
      dia: 'Hoy',
      titulo: 'Revisión de Compresor',
      local: 'Supermercado Norte',
      tecnico: 'Luis A.',
      estado: 'Completada'
    },
    {
      tiempo: '11:30',
      dia: 'Mañana',
      titulo: 'Instalación NFC Tag',
      local: 'Minimarket Central',
      tecnico: 'Pedro V.',
      estado: 'Programada'
    }
  ];

  estados = ['Pendiente', 'Completada', 'Programada'];
  dias = ['Hoy', 'Mañana', 'En 2 días', 'En 3 días'];
  tecnicos = ['Carlos M.', 'Luis A.', 'Pedro V.', 'Juan D.'];

  newVisita: Visita = {
    tiempo: '',
    dia: 'Hoy',
    titulo: '',
    local: '',
    tecnico: '',
    estado: 'Pendiente'
  };

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('visitas');
  }

  setActiveTab(tab: 'list' | 'create'): void {
    this.activeTab = tab;
  }

  createVisita(): void {
    if (this.newVisita.tiempo && this.newVisita.titulo && this.newVisita.local && this.newVisita.tecnico) {
      if (this.isEditing && this.editingIndex !== null) {
        this.visitas[this.editingIndex] = { ...this.newVisita };
        this.cancelEdit();
      } else {
        this.visitas.push({ ...this.newVisita });
        this.resetForm();
      }
      this.activeTab = 'list';
    }
  }

  editVisita(index: number): void {
    this.newVisita = { ...this.visitas[index] };
    this.isEditing = true;
    this.editingIndex = index;
    this.activeTab = 'create';
  }

  deleteVisita(index: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta visita? Esta acción no puede deshacerse.')) {
      this.visitas.splice(index, 1);
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingIndex = null;
  }

  resetForm(): void {
    this.newVisita = {
      tiempo: '',
      dia: 'Hoy',
      titulo: '',
      local: '',
      tecnico: '',
      estado: 'Pendiente'
    };
  }

  getStatusClass(estado: string): string {
    const map: Record<string, string> = {
      'Pendiente': 'pending',
      'Completada': 'done',
      'Programada': 'scheduled'
    };
    return map[estado] ?? '';
  }
}
