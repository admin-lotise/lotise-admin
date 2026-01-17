import { Injectable, signal, computed } from '@angular/core';
import { RaffleSettings, DEFAULT_RAFFLE_SETTINGS, WebPageConfig } from '../../shared/models/raffle-settings.model';

@Injectable({
  providedIn: 'root'
})
export class RaffleSettingsStateService {
  // ==================== STATE ====================
  
  // Settings completos
  private settingsState = signal<RaffleSettings>({
    ...DEFAULT_RAFFLE_SETTINGS,
    tenantId: '', // Solo aquí, después del spread
  });

  // Loading states
  private isLoadingState = signal(false);
  private isSavingState = signal(false);
  private errorState = signal<string | null>(null);

  // ==================== COMPUTED ====================
  
  // Getters públicos
  settings = computed(() => this.settingsState());
  isLoading = computed(() => this.isLoadingState());
  isSaving = computed(() => this.isSavingState());
  error = computed(() => this.errorState());

  // Configuración general
  generalConfig = computed(() => ({
    minutesToClose: this.settingsState().minutesToClose,
    ticketsPerPage: this.settingsState().ticketsPerPage,
    luckyMachineOptions: this.settingsState().luckyMachineOptions
  }));

  // Configuración de página web
  webPageConfig = computed(() => this.settingsState().webPageConfig);

  // ==================== ACTIONS ====================
  
  /**
   * Cargar configuración
   */
  loadSettings(settings: RaffleSettings): void {
    this.settingsState.set(settings);
  }

  /**
   * Actualizar configuración general
   */
  updateGeneralConfig(config: Partial<{
    minutesToClose: number;
    ticketsPerPage: number;
    luckyMachineOptions: string;
  }>): void {
    this.settingsState.update(current => ({
      ...current,
      ...config,
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar configuración de página web
   */
  updateWebPageConfig(config: Partial<WebPageConfig>): void {
    this.settingsState.update(current => ({
      ...current,
      webPageConfig: {
        ...current.webPageConfig,
        ...config
      },
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar configuración completa
   */
  updateSettings(settings: Partial<RaffleSettings>): void {
    this.settingsState.update(current => ({
      ...current,
      ...settings,
      updatedAt: new Date()
    }));
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.isLoadingState.set(loading);
  }

  /**
   * Set saving state
   */
  setSaving(saving: boolean): void {
    this.isSavingState.set(saving);
  }

  /**
   * Set error
   */
  setError(error: string | null): void {
    this.errorState.set(error);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.settingsState.set({
      ...DEFAULT_RAFFLE_SETTINGS,
      tenantId: '', // Solo aquí, después del spread
    });
    this.errorState.set(null);
  }
}