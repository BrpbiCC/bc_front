import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-metricas-globales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metricas-globales.html',
  styleUrls: ['./metricas-globales.css']
})
export class MetricasGlobales implements OnInit {

  metricas = [
    { label: 'Total Tenants', valor: '5', icono: '🏢', color: 'blue' },
    { label: 'Usuarios Globales', valor: '397', icono: '👥', color: 'purple' },
    { label: 'Tickets Abiertos', valor: '84', icono: '🎫', color: 'red' },
    { label: 'Uptime Promedio', valor: '99.2%', icono: '📡', color: 'green' },
  ];

  tenantActividad = [
    { nombre: 'Empresa Alpha', tickets: 12, usuarios: 24, uptime: '99.8%', carga: 30 },
    { nombre: 'Corporación Beta', tickets: 38, usuarios: 120, uptime: '98.9%', carga: 85 },
    { nombre: 'Grupo Gamma', tickets: 3, usuarios: 8, uptime: '95.1%', carga: 10 },
    { nombre: 'Holding Delta', tickets: 21, usuarios: 45, uptime: '99.4%', carga: 55 },
    { nombre: 'Servicios Épsilon', tickets: 10, usuarios: 200, uptime: '99.9%', carga: 100 },
  ];

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('metricas-globales');
  }

  getCargaClass(carga: number): string {
    if (carga >= 80) return 'carga-alta';
    if (carga >= 50) return 'carga-media';
    return 'carga-baja';
  }
}