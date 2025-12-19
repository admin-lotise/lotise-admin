import { Injectable, signal, computed } from '@angular/core';
import { RaffleSettings, DEFAULT_RAFFLE_SETTINGS, WebPageConfig } from '../../shared/models/raffle-settings.model';

@Injectable({
  providedIn: 'root'
})
export class RaffleSettingsStateService {
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
   * Establecer la configuración completa
   */
  setRaffleSettings(settings: RaffleSettings): void {
    this._raffleSettings.set(settings);
  }

  /**
   * Actualizar configuración parcialmente
   */
  updateRaffleSettings(updates: Partial<RaffleSettings>): void {
    this._raffleSettings.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar configuración general
   */
  updateGeneralSettings(
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
   * Actualizar configuración de página web
   */
  updateWebPageConfig(webPageConfig: Partial<WebPageConfig>): void {
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
  resetToDefaults(): void {
    this._raffleSettings.update(current => ({
      ...current,
      ...DEFAULT_RAFFLE_SETTINGS,
      updatedAt: new Date()
    }));
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