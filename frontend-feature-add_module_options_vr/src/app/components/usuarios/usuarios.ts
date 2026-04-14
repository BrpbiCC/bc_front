import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../core/services/filter.service';
import { ViewSearchFiltersComponent } from '../view-search-filters/view-search-filters.component';

interface Usuario {
  name: string;
  role: string;
  status: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewSearchFiltersComponent],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  activeTab: 'list' | 'create' = 'list';
  isEditing = false;
  editingIndex: number | null = null;
  
  usuarios: Usuario[] = [
    { name: 'Carlos Mendoza', role: 'Técnico de Campo', status: 'Activo' },
    { name: 'Luis Araya', role: 'Técnico de Campo', status: 'Activo' },
    { name: 'Admin Sistema', role: 'Administrador', status: 'Activo' },
    { name: 'Pedro Vásquez', role: 'Supervisor', status: 'Inactivo' }
  ];

  newUsuario: Usuario = {
    name: '',
    role: '',
    status: 'Activo'
  };

  roles = ['Técnico de Campo', 'Administrador', 'Supervisor', 'Operario'];

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('usuarios');
  }

  setActiveTab(tab: 'list' | 'create'): void {
    this.activeTab = tab;
  }

  createUsuario(): void {
    if (this.newUsuario.name && this.newUsuario.role) {
      if (this.isEditing && this.editingIndex !== null) {
        this.usuarios[this.editingIndex] = { ...this.newUsuario };
        this.cancelEdit();
      } else {
        this.usuarios.push({ ...this.newUsuario });
        this.resetForm();
      }
      this.activeTab = 'list';
    }
  }

  editUsuario(index: number): void {
    this.newUsuario = { ...this.usuarios[index] };
    this.isEditing = true;
    this.editingIndex = index;
    this.activeTab = 'create';
  }

  deleteUsuario(index: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no puede deshacerse.')) {
      this.usuarios.splice(index, 1);
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingIndex = null;
  }

  resetForm(): void {
    this.newUsuario = {
      name: '',
      role: '',
      status: 'Activo'
    };
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }
}
