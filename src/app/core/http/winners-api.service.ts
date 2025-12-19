import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Winner, CreateWinnerDto, UpdateWinnerDto } from '../../shared/models/winner.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WinnersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/winners`;

  /**
   * Obtener todos los ganadores del tenant
   */
  getWinners(tenantId: string): Observable<Winner[]> {
    return this.http.get<Winner[]>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Obtener ganador por ID
   */
  getWinnerById(tenantId: string, winnerId: string): Observable<Winner> {
    return this.http.get<Winner>(`${this.baseUrl}/${tenantId}/${winnerId}`);
  }

  /**
   * Crear nuevo ganador
   */
  createWinner(tenantId: string, winner: CreateWinnerDto): Observable<Winner> {
    return this.http.post<Winner>(`${this.baseUrl}/${tenantId}`, winner);
  }

  /**
   * Actualizar ganador
   */
  updateWinner(
    tenantId: string, 
    winnerId: string, 
    updates: UpdateWinnerDto
  ): Observable<Winner> {
    return this.http.put<Winner>(`${this.baseUrl}/${tenantId}/${winnerId}`, updates);
  }

  /**
   * Eliminar ganador
   */
  deleteWinner(tenantId: string, winnerId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/${winnerId}`);
  }

  /**
   * Subir foto del ganador
   */
  uploadWinnerPhoto(
    tenantId: string, 
    winnerId: string, 
    file: File
  ): Observable<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<{ photoUrl: string }>(
      `${this.baseUrl}/${tenantId}/${winnerId}/upload-photo`, 
      formData
    );
  }

  /**
   * Eliminar foto del ganador
   */
  deleteWinnerPhoto(tenantId: string, winnerId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/${winnerId}/photo`);
  }

  /**
   * Activar/Desactivar ganador
   */
  toggleActive(tenantId: string, winnerId: string, isActive: boolean): Observable<Winner> {
    return this.http.patch<Winner>(
      `${this.baseUrl}/${tenantId}/${winnerId}/toggle-active`, 
      { isActive }
    );
  }

  /**
   * Obtener ganadores por rifa
   */
  getWinnersByRaffle(tenantId: string, raffleId: string): Observable<Winner[]> {
    return this.http.get<Winner[]>(`${this.baseUrl}/${tenantId}/raffle/${raffleId}`);
  }

  /**
   * Obtener solo ganadores activos (para web pública)
   */
  getActiveWinners(tenantId: string): Observable<Winner[]> {
    return this.http.get<Winner[]>(`${this.baseUrl}/${tenantId}/active`);
  }

  /**
   * Obtener ganadores recientes (últimos 5)
   */
  getRecentWinners(tenantId: string, limit: number = 5): Observable<Winner[]> {
    return this.http.get<Winner[]>(`${this.baseUrl}/${tenantId}/recent?limit=${limit}`);
  }
}