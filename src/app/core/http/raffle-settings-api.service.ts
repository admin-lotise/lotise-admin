import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  RaffleSettings, 
  UpdateRaffleSettingsDto,
  UpdateGeneralSettingsDto,
  UpdateWebPageConfigDto
} from '../../shared/models/raffle-settings.model';
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
   * Actualizar configuración completa de rifas
   */
  updateRaffleSettings(
    tenantId: string, 
    updates: UpdateRaffleSettingsDto
  ): Observable<RaffleSettings> {
    return this.http.put<RaffleSettings>(`${this.baseUrl}/${tenantId}`, updates);
  }

  /**
   * Actualizar solo configuración general
   */
  updateGeneralSettings(
    tenantId: string,
    minutesToClose: number,
    ticketsPerPage: number,
    luckyMachineOptions: string
  ): Observable<RaffleSettings> {
    const dto: UpdateGeneralSettingsDto = {
      minutesToClose,
      ticketsPerPage,
      luckyMachineOptions
    };
    return this.http.patch<RaffleSettings>(`${this.baseUrl}/${tenantId}/general`, dto);
  }

  /**
   * Actualizar solo configuración de página web
   */
  updateWebPageConfig(
    tenantId: string,
    webPageConfig: UpdateWebPageConfigDto
  ): Observable<RaffleSettings> {
    return this.http.patch<RaffleSettings>(
      `${this.baseUrl}/${tenantId}/webpage`, 
      webPageConfig
    );
  }

  /**
   * Resetear a valores por defecto
   */
  resetToDefaults(tenantId: string): Observable<RaffleSettings> {
    return this.http.post<RaffleSettings>(`${this.baseUrl}/${tenantId}/reset`, {});
  }
}