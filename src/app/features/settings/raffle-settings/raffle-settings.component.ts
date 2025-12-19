import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralConfigComponent } from './general-config/general-config.component';
import { TicketSettingsComponent } from './ticket-settings/ticket-settings.component';
import { TimingSettingsComponent } from './timing-settings/timing-settings.component';
import { RaffleSettingsStateService } from '../../../core/signals/raffle-settings-state.service';

type TabType = 'general' | 'ticket' | 'timing';

@Component({
  selector: 'app-raffle-settings',
  standalone: true,
  imports: [
    CommonModule,
    GeneralConfigComponent,
    TicketSettingsComponent,
    TimingSettingsComponent
  ],
  templateUrl: './raffle-settings.component.html',
  styleUrl: './raffle-settings.component.scss'
})
export class RaffleSettingsComponent implements OnInit {
  raffleSettingsState = inject(RaffleSettingsStateService);

  // Signals del estado global
  raffleSettings = this.raffleSettingsState.raffleSettings;
  isLoading = this.raffleSettingsState.isLoadingRaffleSettings;
  error = this.raffleSettingsState.raffleSettingsError;

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
    this.raffleSettingsState.loadRaffleSettings();
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
   * Maneja el guardado de la configuración general
   */
  async onGeneralConfigSave(data: any): Promise<void> {
    this.isSaving.set(true);
    try {
      await this.raffleSettingsState.updateRaffleSettings({
        minutesToClose: data.minutesToClose,
        ticketsPerPage: data.ticketsPerPage,
        luckyMachineOptions: data.luckyMachineOptions
      });
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
      await this.raffleSettingsState.updateWebPageConfig({
        showVerifier: data.showVerifier,
        showParticipants: data.showParticipants,
        showTimer: data.showTimer,
        showTicketsSold: data.showTicketsSold,
        showPrivacyPolicy: data.showPrivacyPolicy,
        showTerms: data.showTerms,
        openWhatsAppDirect: data.openWhatsAppDirect
      });
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
      await this.raffleSettingsState.updateWebPageConfig({
        primaryColor: data.primaryColor,
        primaryColorContrast: data.primaryColorContrast,
        secondaryColor: data.secondaryColor,
        secondaryColorContrast: data.secondaryColorContrast
      });
    } finally {
      this.isSaving.set(false);
    }
  }
}