import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MachinesService } from '../../core/services/machines.service';
import { Machine } from '../../core/models/machine.model';

@Component({
  selector: 'app-mapa-locales',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mapa-locales.component.html',
  styleUrls: ['./mapa-locales.component.scss'],
})
export class MapaLocalesComponent implements OnInit, AfterViewInit {
  machines: Machine[] = [];
  loading = false; // Inicializar como false para mostrar mapa inmediatamente
  errorMessage = '';
  selectedMachine: Machine | null = null;

  center: google.maps.LatLngLiteral = { lat: -33.4489, lng: -70.6693 };
  zoom = 12;
  mapOptions: google.maps.MapOptions = {
    center: this.center,
    zoom: this.zoom,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    minZoom: 4,
    maxZoom: 18,
  };

  markers: google.maps.Marker[] = [];
  infoWindows: google.maps.InfoWindow[] = [];
  private nativeMap?: google.maps.Map;

  constructor(private machinesService: MachinesService) {}

  ngOnInit(): void {
    // Cargar datos de ejemplo inmediatamente para mostrar mapa funcional
    this.initializeExampleData();
    // Intentar cargar datos reales en segundo plano
    this.loadMachines();
  }

  ngAfterViewInit(): void {
    // El mapa se inicializará cuando el DOM esté listo
    // No necesitamos cambiar loading aquí ya que se muestra inmediatamente
  }

  private initializeExampleData(): void {
    // Crear datos de ejemplo para mostrar mapa funcional
    this.machines = [
      {
        id: '1',
        tenantId: 'tenant-1',
        name: 'Máquina Ejemplo 1',
        type: 'Refrigerador',
        brand: 'Samsung',
        model: 'RT38K5932S8',
        serialNumber: 'SN123456789',
        nfcTagId: 'FC001',
        nfcCode: 'FRIOCHECK001',
        clientName: 'Oficina Central FrioCheck',
        clientId: 'client-1',
        clientAddress: 'Av. Providencia 123, Santiago, Chile',
        clientPhone: '+56912345678',
        clientRut: '12.345.678-9',
        status: 'OPERATIVE',
        latitude: -33.4489,
        longitude: -70.6693,
        isActive: true
      }
    ];
  }

  public loadMachines(): void {
    // No cambiar loading aquí para mantener el mapa visible con datos de ejemplo
    this.errorMessage = '';

    this.machinesService.getMachines().subscribe({
      next: (response) => {
        const realData = response.data || [];
        if (realData.length > 0) {
          // Si hay datos reales, reemplazar los de ejemplo
          this.machines = realData;
          if (this.nativeMap) {
            this.createMarkers();
          }
        }
        // No cambiar loading ya que el mapa ya está visible
      },
      error: () => {
        // En caso de error, mantener datos de ejemplo y mostrar mensaje
        this.errorMessage = 'Mostrando datos de ejemplo - No se pudo conectar al servicio';
      },
    });
  }

  onMapReady(map: google.maps.Map | Event): void {
    this.nativeMap = map as google.maps.Map;

    // Crear marcadores inmediatamente con datos de ejemplo
    this.createMarkers();
  }

  private createMarkers(): void {
    if (!this.nativeMap) return;

    const nativeMap = this.nativeMap;
    this.clearMarkers();

    this.machines.forEach((machine) => {
      if (machine.latitude != null && machine.longitude != null) {
        const marker = new google.maps.Marker({
          position: { lat: machine.latitude, lng: machine.longitude },
          map: nativeMap,
          title: machine.clientName,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: this.createInfoWindowContent(machine),
        });

        marker.addListener('click', () => {
          this.closeAllInfoWindows();
          infoWindow.open(nativeMap, marker);
          this.selectedMachine = machine;
        });

        this.markers.push(marker);
        this.infoWindows.push(infoWindow);
      }
    });

    // Center map on markers after creating them
    this.centerMapOnMarkers();
  }

  private createInfoWindowContent(machine: Machine): string {
    return `
      <div class="info-window-content">
        <h3>${machine.clientName}</h3>
        <p><strong>Dirección:</strong> ${machine.clientAddress}</p>
        <p><strong>NFC ID:</strong> ${machine.nfcTagId || 'N/A'}</p>
        <p><strong>NFC Code:</strong> ${machine.nfcCode || 'N/A'}</p>
        <p><strong>Estado:</strong> <span class="status-badge status-${machine.status.toLowerCase()}">${machine.status}</span></p>
        <p><strong>Tipo:</strong> ${machine.type || 'N/A'}</p>
      </div>
    `;
  }

  private centerMapOnMarkers(): void {
    if (!this.nativeMap || this.markers.length === 0) return;

    const nativeMap = this.nativeMap;
    const bounds = new google.maps.LatLngBounds();
    
    this.markers.forEach((marker) => {
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
      }
    });

    if (this.markers.length === 1) {
      const position = this.markers[0].getPosition();
      if (position) {
        nativeMap.setCenter(position);
        nativeMap.setZoom(13);
      }
    } else if (!bounds.isEmpty()) {
      nativeMap.fitBounds(bounds, 32);
    }
  }

  private closeAllInfoWindows(): void {
    this.infoWindows.forEach((infoWindow) => infoWindow.close());
  }

  private clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
    this.infoWindows = [];
  }

  public refresh(): void {
    this.loadMachines();
  }
}
