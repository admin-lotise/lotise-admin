import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsStateService } from '../../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../../core/http/settings-api.service';
import { StorageService } from '../../../../core/auth/storage.service';
import { FileUploadRequest } from '../../../../shared/models/settings.model';

/**
 * Componente para gestión de datos generales del negocio
 * Incluye: Nombre, Nosotros (texto enriquecido) y Logo
 */
@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.scss'
})
export class GeneralInfoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsState = inject(SettingsStateService);
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);

  // Signals locales
  readonly isSaving = signal(false);
  readonly isUploadingLogo = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);

  // Form reactivo
  generalInfoForm!: FormGroup;

  // Computed: Logo actual del estado
  readonly currentLogoUrl = computed(() => this.settingsState.businessProfile().logoUrl);

  ngOnInit(): void {
    this.initializeForm();
    this.loadFormData();
  }

  /**
   * Inicializar formulario con validaciones
   */
  private initializeForm(): void {
    this.generalInfoForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      aboutUs: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });
  }

  /**
   * Cargar datos desde el estado
   */
  private loadFormData(): void {
    const profile = this.settingsState.businessProfile();
    this.generalInfoForm.patchValue({
      businessName: profile.businessName,
      aboutUs: profile.aboutUs
    });
  }

  /**
   * Guardar datos generales
   */
  onSubmit(): void {
    if (this.generalInfoForm.invalid) {
      this.generalInfoForm.markAllAsTouched();
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    const { businessName, aboutUs } = this.generalInfoForm.value;

    // ✅ CORREGIDO: tenant.tenantId → tenant.id
    this.settingsApi.updateGeneralInfo(tenant.tenantId, businessName, aboutUs).subscribe({
      next: (response) => {
        // Actualizar estado global
        this.settingsState.updateGeneralInfo(businessName, aboutUs);
        this.isSaving.set(false);
        this.showSuccess('Datos generales guardados correctamente');
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        this.isSaving.set(false);
        this.showError('Error al guardar los datos. Intenta nuevamente.');
      }
    });
  }

  /**
   * Manejar selección de archivo (logo)
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.showError('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showError('La imagen no puede superar los 5MB');
      return;
    }

    this.selectedFile.set(file);

    // Generar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Subir logo a S3
   */
  uploadLogo(): void {
    const file = this.selectedFile();
    const tenant = this.storageService.getTenant();

    if (!file || !tenant) return;

    this.isUploadingLogo.set(true);
    this.clearMessages();

    const uploadRequest: FileUploadRequest = {
      file,
      tenantId: tenant.tenantId, // ✅ CORREGIDO: tenant.tenantId → tenant.id
      fileType: 'logo'
    };

    this.settingsApi.uploadLogo(uploadRequest).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar estado global con nueva URL
          this.settingsState.updateLogoUrl(response.url);
          this.selectedFile.set(null);
          this.previewUrl.set(null);
          this.isUploadingLogo.set(false);
          this.showSuccess('Logo subido correctamente');
        }
      },
      error: (error) => {
        console.error('Error al subir logo:', error);
        this.isUploadingLogo.set(false);
        this.showError('Error al subir el logo. Intenta nuevamente.');
      }
    });
  }

  /**
   * Cancelar selección de archivo
   */
  cancelFileSelection(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  /**
   * Eliminar logo actual
   */
  removeLogo(): void {
    if (confirm('¿Estás seguro de eliminar el logo actual?')) {
      this.settingsState.updateLogoUrl(null);
      this.showSuccess('Logo eliminado');
    }
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

  // Getters para template
  get businessName() { return this.generalInfoForm.get('businessName'); }
  get aboutUs() { return this.generalInfoForm.get('aboutUs'); }
}