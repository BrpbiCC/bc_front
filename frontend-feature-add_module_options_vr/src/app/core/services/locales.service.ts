import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Local } from '../models/local.model';

const MOCK_LOCALES: Local[] = [
  {
    id: 'local-001',
    nombre: 'Sucursal Centro',
    direccion: 'Av. Principal 123, Santiago',
    latitud: -33.4489,
    longitud: -70.6693,
    nfc: {
      id: 'NFC-24A3',
      nombre: 'NFC Centro',
      estado: 'activo',
    },
  },
  {
    id: 'local-002',
    nombre: 'Sucursal Norte',
    direccion: 'Calle Norte 456, Santiago',
    latitud: -33.4049,
    longitud: -70.6450,
    nfc: {
      id: 'NFC-19B2',
      nombre: 'NFC Norte',
      estado: 'inactivo',
    },
  },
  {
    id: 'local-003',
    nombre: 'Sucursal Sur',
    direccion: 'Av. Sur 789, Santiago',
    latitud: -33.5050,
    longitud: -70.6910,
    nfc: {
      id: 'NFC-33C7',
      nombre: 'NFC Sur',
      estado: 'activo',
    },
  },
];

@Injectable({
  providedIn: 'root',
})
export class LocalesService {
  constructor(private http: HttpClient) {}

  getLocalesMapa(): Observable<Local[]> {
    return this.http.get<Local[]>('/api/locales/mapa').pipe(
      catchError(() => {
        return of(MOCK_LOCALES);
      })
    );
  }
}

/* Ejemplo mock JSON de respuesta API:
[
  {
    "id": "local-001",
    "nombre": "Sucursal Centro",
    "direccion": "Av. Principal 123, Santiago",
    "latitud": -33.4489,
    "longitud": -70.6693,
    "nfc": {
      "id": "NFC-24A3",
      "nombre": "NFC Centro",
      "estado": "activo"
    }
  },
  {
    "id": "local-002",
    "nombre": "Sucursal Norte",
    "direccion": "Calle Norte 456, Santiago",
    "latitud": -33.4049,
    "longitud": -70.6450,
    "nfc": {
      "id": "NFC-19B2",
      "nombre": "NFC Norte",
      "estado": "inactivo"
    }
  }
]
*/
