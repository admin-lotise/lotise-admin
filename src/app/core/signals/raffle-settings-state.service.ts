import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs'; // ← IMPORTANTE
import { RaffleSettings, DEFAULT_RAFFLE_SETTINGS, WebPageConfig } from '../../shared/models/raffle-settings.model';
import { RaffleSettingsApiService } from '../http/raffle-settings-api.service';

@Injectable({
  providedIn: 'root'
})
export class RaffleSettingsStateService {
  private readonly raffleSettingsApi = inject(RaffleSettingsApiService);

  // Signal privado para el estado
  private readonly _raffleSettings = signal<RaffleSettings>({
    tenantId: '',
    ...DEFAULT_RAFFLE_SETTINGS,
    updatedAt: new Date()
  } as RaffleSettings);

  // Signal para loading
  private readonly _isLoadingRaffleSettings = signal<boolean>(false);
  
  // Signal para errores
  private readonly _raffleSettingsError = signal<string | null>(null);

  // Signals públicos (readonly)
  readonly raffleSettings = this._raffleSettings.asReadonly();
  readonly isLoadingRaffleSettings = this._isLoadingRaffleSettings.asReadonly();
  readonly raffleSettingsError = this._raffleSettingsError.asReadonly();

  // Computed signals útiles
  readonly minutesToClose = computed(() => this._raffleSettings().minutesToClose);
  readonly ticketsPerPage = computed(() => this._raffleSettings().ticketsPerPage);
  readonly webPageConfig = computed(() => this._raffleSettings().webPageConfig);

  /**
   * Cargar configuración de rifas desde la API
   */
  async loadRaffleSettings(): Promise<void> {
    this._isLoadingRaffleSettings.set(true);
    this._raffleSettingsError.set(null);

    try {
      // TODO: Obtener tenantId desde AuthStateService cuando esté implementado
      const tenantId = 'tenant-demo'; // ← Temporal

      const settings = await firstValueFrom(
        this.raffleSettingsApi.getRaffleSettings(tenantId)
      );

      this._raffleSettings.set(settings);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al cargar la configuración de rifas';
      this._raffleSettingsError.set(errorMessage);
      console.error('Error loading raffle settings:', error);
    } finally {
      this._isLoadingRaffleSettings.set(false);
    }
  }

  /**
   * Actualizar configuración de rifas en la API
   */
  async updateRaffleSettings(updates: Partial<RaffleSettings>): Promise<void> {
    try {
      const tenantId = this._raffleSettings().tenantId || 'tenant-demo';

      const updatedSettings = await firstValueFrom(
        this.raffleSettingsApi.updateGeneralSettings(
          tenantId,
          updates.minutesToClose!,
          updates.ticketsPerPage!,
          updates.luckyMachineOptions!
        )
      );

      this._raffleSettings.set(updatedSettings);
      this._raffleSettingsError.set(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al actualizar la configuración';
      this._raffleSettingsError.set(errorMessage);
      throw error;
    }
  }

  /**
   * Actualizar configuración de página web en la API
   */
  async updateWebPageConfig(webPageConfig: Partial<WebPageConfig>): Promise<void> {
    try {
      const tenantId = this._raffleSettings().tenantId || 'tenant-demo';

      const updatedSettings = await firstValueFrom(
        this.raffleSettingsApi.updateWebPageConfig(tenantId, webPageConfig)
      );

      this._raffleSettings.set(updatedSettings);
      this._raffleSettingsError.set(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al actualizar la configuración de página web';
      this._raffleSettingsError.set(errorMessage);
      throw error;
    }
  }

  /**
   * Establecer la configuración completa
   */
  setRaffleSettings(settings: RaffleSettings): void {
    this._raffleSettings.set(settings);
  }

  /**
   * Actualizar configuración parcialmente (solo local, NO llama API)
   */
  updateRaffleSettingsLocal(updates: Partial<RaffleSettings>): void {
    this._raffleSettings.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar configuración general (solo local, NO llama API)
   */
  updateGeneralSettingsLocal(
    minutesToClose: number,
    ticketsPerPage: number,
    luckyMachineOptions: string
  ): void {
    this._raffleSettings.update(current => ({
      ...current,
      minutesToClose,
      ticketsPerPage,
      luckyMachineOptions,
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar configuración de página web (solo local, NO llama API)
   */
  updateWebPageConfigLocal(webPageConfig: Partial<WebPageConfig>): void {
    this._raffleSettings.update(current => ({
      ...current,
      webPageConfig: {
        ...current.webPageConfig,
        ...webPageConfig
      },
      updatedAt: new Date()
    }));
  }

  /**
   * Establecer estado de carga
   */
  setLoadingRaffleSettings(loading: boolean): void {
    this._isLoadingRaffleSettings.set(loading);
  }

  /**
   * Establecer error
   */
  setRaffleSettingsError(error: string | null): void {
    this._raffleSettingsError.set(error);
  }

  /**
   * Limpiar error
   */
  clearRaffleSettingsError(): void {
    this._raffleSettingsError.set(null);
  }

  /**
   * Resetear a valores por defecto
   */
  async resetToDefaults(): Promise<void> {
    try {
      const tenantId = this._raffleSettings().tenantId || 'tenant-demo';
      
      const settings = await firstValueFrom(
        this.raffleSettingsApi.resetToDefaults(tenantId)
      );
      
      this._raffleSettings.set(settings);
      this._raffleSettingsError.set(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al resetear configuración';
      this._raffleSettingsError.set(errorMessage);
      throw error;
    }
  }

  /**
   * Limpiar estado (logout)
   */
  clear(): void {
    this._raffleSettings.set({
      tenantId: '',
      ...DEFAULT_RAFFLE_SETTINGS,
      updatedAt: new Date()
    } as RaffleSettings);
    this._isLoadingRaffleSettings.set(false);
    this._raffleSettingsError.set(null);
  }
}