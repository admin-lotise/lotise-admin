import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsStateService } from '../../../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../../../core/http/settings-api.service';
import { StorageService } from '../../../../../core/auth/storage.service';

/**
 * Componente para gestión de redes sociales del negocio
 * Permite configurar enlaces a Facebook, Twitter/X, Instagram y TikTok
 */
@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './social-media.component.html',
  styleUrl: './social-media.component.scss'
})
export class SocialMediaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsState = inject(SettingsStateService);
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);

  // Signals locales
  readonly isSaving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // Form reactivo
  socialMediaForm!: FormGroup;

  // Definición de redes sociales disponibles
  readonly socialNetworks = [
    {
      key: 'facebook',
      name: 'Facebook',
      icon: 'fab fa-facebook',
      color: '#1877f2',
      placeholder: 'https://facebook.com/tu-pagina',
      pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/.+/
    },
    {
      key: 'twitter',
      name: 'Twitter / X',
      icon: 'fab fa-x-twitter',
      color: '#000000',
      placeholder: 'https://twitter.com/tu-usuario',
      pattern: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+/
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: 'fab fa-instagram',
      color: '#e4405f',
      placeholder: 'https://instagram.com/tu-usuario',
      pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      icon: 'fab fa-tiktok',
      color: '#000000',
      placeholder: 'https://tiktok.com/@tu-usuario',
      pattern: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/
    }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.loadFormData();
  }

  /**
   * Inicializar formulario con validaciones
   */
  private initializeForm(): void {
    this.socialMediaForm = this.fb.group({
      facebook: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?facebook\.com\/.+/)]],
      twitter: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+/)]],
      instagram: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?instagram\.com\/.+/)]],
      tiktok: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?tiktok\.com\/.+/)]]
    });
  }

  /**
   * Cargar datos desde el estado
   */
  private loadFormData(): void {
    const socialMedia = this.settingsState.businessProfile().socialMedia;
    this.socialMediaForm.patchValue(socialMedia);
  }

  /**
   * Guardar redes sociales
   */
  onSubmit(): void {
    if (this.socialMediaForm.invalid) {
      this.socialMediaForm.markAllAsTouched();
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    const socialMediaData = this.socialMediaForm.value;

    // ✅ CORREGIDO: tenant.tenantId → tenant.tenantId (LUGAR 1)
    this.settingsApi.updateSocialMedia(tenant.tenantId, socialMediaData).subscribe({
      next: (updatedSocialMedia) => {
        // Actualizar estado global
        this.settingsState.updateSocialMedia(updatedSocialMedia);
        this.isSaving.set(false);
        this.showSuccess('Redes sociales actualizadas correctamente');
      },
      error: (error) => {
        console.error('Error al guardar redes sociales:', error);
        this.isSaving.set(false);
        this.showError('Error al guardar. Intenta nuevamente.');
      }
    });
  }

  /**
   * Limpiar un campo específico
   */
  clearField(field: string): void {
    this.socialMediaForm.get(field)?.setValue('');
  }

  /**
   * Validar si un campo tiene URL válida
   */
  hasValidUrl(field: string): boolean {
    const control = this.socialMediaForm.get(field);
    return control?.value && control?.valid;
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

  // Getter para acceder a los controles del formulario
  getControl(field: string) {
    return this.socialMediaForm.get(field);
  }
}