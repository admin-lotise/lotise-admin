import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralConfigComponent } from './general-config/general-config.component';
import { TicketSettingsComponent } from './ticket-settings/ticket-settings.component';
import { TimingSettingsComponent } from './timing-settings/timing-settings.component';
import { BrandingSettingsComponent } from './branding-settings/branding-settings.component'; // ← NUEVO
import { RaffleSettingsStateService } from '../../../core/signals/raffle-settings-state.service';
import { MOCK_RAFFLE_SETTINGS } from '../../../shared/models/raffle-settings.model';

type TabType = 'general' | 'ticket' | 'timing' | 'branding'; // ← Agregado 'branding'

@Component({
  selector: 'app-raffle-settings',
  standalone: true,
  imports: [
    CommonModule,
    GeneralConfigComponent,
    TicketSettingsComponent,
    TimingSettingsComponent,
    BrandingSettingsComponent // ← NUEVO
  ],
  templateUrl: './raffle-settings.component.html',
  styleUrl: './raffle-settings.component.scss'
})
export class RaffleSettingsComponent implements OnInit {
  raffleSettingsState = inject(RaffleSettingsStateService);

  // Signals del estado global
  raffleSettings = this.raffleSettingsState.settings;
  isLoading = this.raffleSettingsState.isLoading;
  error = this.raffleSettingsState.error;

  // Tab activo
  activeTab = signal<TabType>('general');

  // Signal para manejar el guardado
  isSaving = signal(false);

  ngOnInit(): void {
    this.loadRaffleSettings();
  }

  /**
   * Carga la configuración de rifas
   */
  loadRaffleSettings(): void {
    // Simular carga de API
    this.raffleSettingsState.setLoading(true);
    
    setTimeout(() => {
      this.raffleSettingsState.loadSettings(MOCK_RAFFLE_SETTINGS);
      this.raffleSettingsState.setLoading(false);
    }, 500);
  }

  /**
   * Recarga los datos
   */
  reloadData(): void {
    this.loadRaffleSettings();
  }

  /**
   * Cambia el tab activo
   */
  changeTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  /**
   * Limpia el error
   */
  clearError(): void {
    this.raffleSettingsState.clearError();
  }

  /**
   * Maneja el guardado de la configuración general
   */
  async onGeneralConfigSave(data: any): Promise<void> {
    this.isSaving.set(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.raffleSettingsState.updateSettings({
        minutesToClose: data.minutesToClose,
        ticketsPerPage: data.ticketsPerPage,
        luckyMachineOptions: data.luckyMachineOptions
      });
      
      console.log('✅ Configuración general guardada:', data);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      this.raffleSettingsState.setError('Error al guardar la configuración');
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Maneja el guardado de la configuración de tickets (toggles)
   */
  async onTicketSettingsSave(data: any): Promise<void> {
    this.isSaving.set(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.raffleSettingsState.updateWebPageConfig({
        showVerifier: data.showVerifier,
        showParticipants: data.showParticipants,
        showTimer: data.showTimer,
        showTicketsSold: data.showTicketsSold,
        showPrivacyPolicy: data.showPrivacyPolicy,
        showTerms: data.showTerms,
        openWhatsAppDirect: data.openWhatsAppDirect
      });
      
      console.log('✅ Elementos visibles guardados:', data);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      this.raffleSettingsState.setError('Error al guardar los elementos visibles');
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Maneja el guardado de la configuración de timing (colores)
   */
  async onTimingSettingsSave(data: any): Promise<void> {
    this.isSaving.set(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.raffleSettingsState.updateWebPageConfig({
        primaryColor: data.primaryColor,
        primaryColorContrast: data.primaryColorContrast,
        secondaryColor: data.secondaryColor,
        secondaryColorContrast: data.secondaryColorContrast
      });
      
      console.log('✅ Colores guardados:', data);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      this.raffleSettingsState.setError('Error al guardar los colores');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ==================== NUEVO: Branding Save ====================
  async onBrandingSettingsSave(data: any): Promise<void> {
    this.isSaving.set(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.raffleSettingsState.updateWebPageConfig({
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        heroBackgroundUrl: data.heroBackgroundUrl,
        socialLinks: data.socialLinks,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        footerText: data.footerText
      });
      
      console.log('✅ Branding guardado:', data);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      this.raffleSettingsState.setError('Error al guardar el branding');
    } finally {
      this.isSaving.set(false);
    }
  }
}