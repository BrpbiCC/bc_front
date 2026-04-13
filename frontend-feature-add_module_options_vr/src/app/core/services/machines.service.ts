import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Machine, MachineResponse } from '../models/machine.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  private apiUrl = `${environment.apiUrl}/machines`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los locales (máquinas) desde el backend
   * GET /api/v1/machines
   */
  getMachines(): Observable<MachineResponse> {
    return this.http.get<MachineResponse>(this.apiUrl);
  }

  /**
   * Obtiene un local (máquina) específico por ID
   * GET /api/v1/machines/:id
   */
  getMachineById(id: string): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }
}
