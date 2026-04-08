import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenants.html',
  styleUrls: ['./tenants.css']
})
export class Tenants implements OnInit {

  tenants = [
    { id: 'T-001', nombre: 'Empresa Alpha', plan: 'Pro', usuarios: 24, estado: 'Activo', fecha: '2024-01-15' },
    { id: 'T-002', nombre: 'Corporación Beta', plan: 'Enterprise', usuarios: 120, estado: 'Activo', fecha: '2024-02-20' },
    { id: 'T-003', nombre: 'Grupo Gamma', plan: 'Basic', usuarios: 8, estado: 'Inactivo', fecha: '2024-03-10' },
    { id: 'T-004', nombre: 'Holding Delta', plan: 'Pro', usuarios: 45, estado: 'Mantenimiento', fecha: '2024-04-05' },
    { id: 'T-005', nombre: 'Servicios Épsilon', plan: 'Enterprise', usuarios: 200, estado: 'Activo', fecha: '2024-05-18' },
  ];

  columnas = ['id', 'nombre', 'plan', 'usuarios', 'estado', 'fecha'];

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('tenants');
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      'Activo': 'badge-activo',
      'Inactivo': 'badge-inactivo',
      'Mantenimiento': 'badge-mant',
    };
    return map[estado] ?? '';
  }

  getPlanClass(plan: string): string {
    const map: Record<string, string> = {
      'Basic': 'plan-basic',
      'Pro': 'plan-pro',
      'Enterprise': 'plan-enterprise',
    };
    return map[plan] ?? '';
  }
}