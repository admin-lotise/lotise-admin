import { Injectable, signal, computed } from '@angular/core';
import { RaffleSettings, DEFAULT_RAFFLE_SETTINGS } from '../../shared/models/raffle-settings.model';

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

  // Signal público (readonly)
  readonly raffleSettings = this._raffleSettings.asReadonly();

  // Computed signals útiles
  readonly isLuckyMachineEnabled = computed(() => this._raffleSettings().enableLuckyMachine);
  readonly ticketsPerPage = computed(() => this._raffleSettings().ticketsPerPage);
  readonly reservationTime = computed(() => this._raffleSettings().reservationTime);

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
  }
}