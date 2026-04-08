import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';

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
  imports: [CommonModule],
  templateUrl: './activos.html',
  styleUrls: ['./activos.css'],
})
export class Activos implements OnInit {
  activos = DATOS_ACTIVOS;

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.setActiveView('activos');
  }
}
