import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../core/services/filter.service';
import { ViewSearchFiltersComponent } from '../view-search-filters/view-search-filters.component';

interface Pedido {
  orden: string;
  material: string;
  cantidad: number;
  unidad: string;
  prioridad: string;
  fechaSolicitud: string;
  estado: string;
  observaciones?: string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewSearchFiltersComponent],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class Pedidos implements OnInit {
  activeTab = 'list';
  pedidos: Pedido[] = [
    {
      orden: 'ORD-0091',
      material: 'Etiquetas NFC NTAG213',
      cantidad: 500,
      unidad: 'uds',
      prioridad: 'Media',
      fechaSolicitud: '20 Mar 2026',
      estado: 'En Camino'
    },
    {
      orden: 'ORD-0090',
      material: 'Termostato Digital W1209',
      cantidad: 15,
      unidad: 'uds',
      prioridad: 'Alta',
      fechaSolicitud: '15 Mar 2026',
      estado: 'Entregado'
    },
    {
      orden: 'ORD-0089',
      material: 'Sensor de temperatura DS18B20',
      cantidad: 30,
      unidad: 'uds',
      prioridad: 'Baja',
      fechaSolicitud: '10 Mar 2026',
      estado: 'Pendiente'
    }
  ];

  newPedido: Partial<Pedido> = {
    material: '',
    cantidad: 0,
    unidad: 'uds',
    prioridad: 'Media',
    fechaSolicitud: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    observaciones: ''
  };

  unidades = ['uds', 'kg', 'm', 'l', 'm²', 'm³'];
  prioridades = ['Baja', 'Media', 'Alta', 'Urgente'];

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('pedidos');
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  createPedido(): void {
    if (!this.newPedido.material || !this.newPedido.cantidad) {
      return;
    }

    const orden = this.generateOrden();
    const pedido: Pedido = {
      orden,
      material: this.newPedido.material,
      cantidad: this.newPedido.cantidad,
      unidad: this.newPedido.unidad || 'uds',
      prioridad: this.newPedido.prioridad || 'Media',
      fechaSolicitud: this.newPedido.fechaSolicitud || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      estado: 'Pendiente',
      observaciones: this.newPedido.observaciones
    };

    this.pedidos.unshift(pedido);
    this.resetForm();
    this.setActiveTab('list');
  }

  private generateOrden(): string {
    const maxOrden = this.pedidos
      .map(p => parseInt(p.orden.split('-')[1]))
      .reduce((max, num) => Math.max(max, num), 0);
    return `ORD-${String(maxOrden + 1).padStart(4, '0')}`;
  }

  private resetForm(): void {
    this.newPedido = {
      material: '',
      cantidad: 0,
      unidad: 'uds',
      prioridad: 'Media',
      fechaSolicitud: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      observaciones: ''
    };
  }
}
