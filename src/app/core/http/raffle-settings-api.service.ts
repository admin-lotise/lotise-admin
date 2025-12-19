import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RaffleSettings, UpdateRaffleSettingsDto } from '../../shared/models/raffle-settings.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RaffleSettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/raffle-settings`;

  /**
   * Obtener configuración de rifas del tenant
   */
  getRaffleSettings(tenantId: string): Observable<RaffleSettings> {
    return this.http.get<RaffleSettings>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Actualizar configuración de rifas
   */
  updateRaffleSettings(
    tenantId: string, 
    updates: UpdateRaffleSettingsDto
  ): Observable<RaffleSettings> {
    return this.http.put<RaffleSettings>(`${this.baseUrl}/${tenantId}`, updates);
  }

  /**
   * Resetear a valores por defecto
   */
  resetToDefaults(tenantId: string): Observable<RaffleSettings> {
    return this.http.post<RaffleSettings>(`${this.baseUrl}/${tenantId}/reset`, {});
  }
}