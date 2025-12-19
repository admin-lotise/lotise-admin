import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RaffleSettingsStateService } from '../../../core/signals/raffle-settings-state.service';
import { RaffleSettingsApiService } from '../../../core/http/raffle-settings-api.service';
import { StorageService } from '../../../core/auth/storage.service';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Componente para configuración de rifas
 * Permite configurar parámetros generales y apariencia de la página web
 */
@Component({
  selector: 'app-raffle-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './raffle-settings.component.html',
  styleUrl: './raffle-settings.component.scss'
})
export class RaffleSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly raffleSettingsApi = inject(RaffleSettingsApiService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  // ✅ Servicio de estado público para acceso desde template
  readonly raffleSettingsState = inject(RaffleSettingsStateService);

  // Signals locales
  readonly isSaving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly activeTab = signal<'general' | 'webpage'>('general');

  // Forms reactivos
  generalForm!: FormGroup;
  webPageForm!: FormGroup;

  // Signals del estado global
  readonly raffleSettings = this.raffleSettingsState.raffleSettings;
  readonly isLoading = this.raffleSettingsState.isLoadingRaffleSettings;
  readonly error = this.raffleSettingsState.raffleSettingsError;

  ngOnInit(): void {
    this.initializeForms();
    this.loadRaffleSettings();
  }

  /**
   * Inicializar formularios
   */
  private initializeForms(): void {
    // General Settings Form
    this.generalForm = this.fb.group({
      minutesToClose: [30, [Validators.required, Validators.min(5), Validators.max(120)]],
      ticketsPerPage: [50, [Validators.required, Validators.min(10), Validators.max(200)]],
      luckyMachineOptions: ['1,2,3,4,5,6,7,8,9,10', Validators.required]
    });

    // Web Page Config Form
    this.webPageForm = this.fb.group({
      showVerifier: [true],
      showParticipants: [true],
      showTimer: [true],
      showPrivacyPolicy: [false],
      showTerms: [false],
      showTicketsSold: [true],
      openWhatsAppDirect: [false],
      primaryColor: ['#ff497c', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      primaryColorContrast: ['#ffffff', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      secondaryColor: ['#3b82f6', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      secondaryColorContrast: ['#ffffff', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
    });
  }

  /**
   * Cargar configuración desde API
   */
  private loadRaffleSettings(): void {
    const tenant = this.storageService.getTenant();
    
    if (!tenant) {
      console.error('No hay tenant en sesión');
      this.router.navigate(['/login']);
      return;
    }

    this.raffleSettingsState.setLoadingRaffleSettings(true);
    this.raffleSettingsState.clearRaffleSettingsError();

    this.raffleSettingsApi.getRaffleSettings(tenant.tenantId).subscribe({
      next: (settings) => {
        this.raffleSettingsState.setRaffleSettings(settings);
        this.loadFormData();
        this.raffleSettingsState.setLoadingRaffleSettings(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar configuración:', error);
        this.raffleSettingsState.setRaffleSettingsError('Error al cargar la configuración');
        this.raffleSettingsState.setLoadingRaffleSettings(false);
      }
    });
  }

  /**
   * Cargar datos en los formularios
   */
  private loadFormData(): void {
    const settings = this.raffleSettingsState.raffleSettings();

    this.generalForm.patchValue({
      minutesToClose: settings.minutesToClose,
      ticketsPerPage: settings.ticketsPerPage,
      luckyMachineOptions: settings.luckyMachineOptions
    });

    this.webPageForm.patchValue({
      showVerifier: settings.webPageConfig.showVerifier,
      showParticipants: settings.webPageConfig.showParticipants,
      showTimer: settings.webPageConfig.showTimer,
      showPrivacyPolicy: settings.webPageConfig.showPrivacyPolicy,
      showTerms: settings.webPageConfig.showTerms,
      showTicketsSold: settings.webPageConfig.showTicketsSold,
      openWhatsAppDirect: settings.webPageConfig.openWhatsAppDirect,
      primaryColor: settings.webPageConfig.primaryColor,
      primaryColorContrast: settings.webPageConfig.primaryColorContrast,
      secondaryColor: settings.webPageConfig.secondaryColor,
      secondaryColorContrast: settings.webPageConfig.secondaryColorContrast
    });
  }

  /**
   * Guardar configuración general
   */
  onSubmitGeneral(): void {
    if (this.generalForm.invalid) {
      this.generalForm.markAllAsTouched();
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    const formValue = this.generalForm.value;

    this.raffleSettingsApi.updateGeneralSettings(
      tenant.tenantId,
      formValue.minutesToClose,
      formValue.ticketsPerPage,
      formValue.luckyMachineOptions
    ).subscribe({
      next: () => {
        this.raffleSettingsState.updateGeneralSettings(
          formValue.minutesToClose,
          formValue.ticketsPerPage,
          formValue.luckyMachineOptions
        );
        this.isSaving.set(false);
        this.showSuccess('Configuración general guardada correctamente');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar:', error);
        this.isSaving.set(false);
        this.showError('Error al guardar la configuración. Intenta nuevamente.');
      }
    });
  }

  /**
   * Guardar configuración de página web
   */
  onSubmitWebPage(): void {
    if (this.webPageForm.invalid) {
      this.webPageForm.markAllAsTouched();
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    const webPageConfig = this.webPageForm.value;

    this.raffleSettingsApi.updateWebPageConfig(tenant.tenantId, webPageConfig).subscribe({
      next: () => {
        this.raffleSettingsState.updateWebPageConfig(webPageConfig);
        this.isSaving.set(false);
        this.showSuccess('Configuración de página web guardada correctamente');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar:', error);
        this.isSaving.set(false);
        this.showError('Error al guardar la configuración. Intenta nuevamente.');
      }
    });
  }

  /**
   * Cambiar tab activo
   */
  changeTab(tab: 'general' | 'webpage'): void {
    this.activeTab.set(tab);
  }

  /**
   * Recargar datos
   */
  reloadData(): void {
    this.loadRaffleSettings();
  }

  // ==================== HELPERS ====================

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 5000);
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    setTimeout(() => this.errorMessage.set(null), 5000);
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  // Getters para template (General Form)
  get minutesToClose() { return this.generalForm.get('minutesToClose'); }
  get ticketsPerPage() { return this.generalForm.get('ticketsPerPage'); }
  get luckyMachineOptions() { return this.generalForm.get('luckyMachineOptions'); }

  // Getters para template (Web Page Form)
  get primaryColor() { return this.webPageForm.get('primaryColor'); }
  get primaryColorContrast() { return this.webPageForm.get('primaryColorContrast'); }
  get secondaryColor() { return this.webPageForm.get('secondaryColor'); }
  get secondaryColorContrast() { return this.webPageForm.get('secondaryColorContrast'); }
}