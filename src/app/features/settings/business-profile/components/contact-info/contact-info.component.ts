import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsStateService } from '../../../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../../../core/http/settings-api.service';
import { StorageService } from '../../../../../core/auth/storage.service';
import { ContactSection, UpdateContactSectionDto } from '../../../../../shared/models/settings.model';

/**
 * Componente para gestión de la sección de contacto en Bio Page
 */
@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsState = inject(SettingsStateService);
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);

  // ==================== SIGNALS ====================
  readonly isSaving = signal(false);
  readonly hasChanges = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // ==================== COMPUTED ====================
  readonly contactSection = computed(() => this.settingsState.bioPage().contact);
  readonly isSectionEnabled = computed(() => this.contactSection().enabled);

  // ==================== FORM ====================
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }

  // ==================== FORM INITIALIZATION ====================

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      enabled: [true],
      title: ['Contáctanos', [Validators.required, Validators.maxLength(100)]],
      subtitle: ['', [Validators.maxLength(200)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20)]],
      whatsapp: ['', [Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(200)]],
      scheduleText: ['', [Validators.maxLength(300)]]
    });

    // Detectar cambios (excepto en 'enabled' para evitar loops)
    this.contactForm.valueChanges.subscribe((values) => {
      // Solo marcar cambios si no es toggle automático
      if (!this.isSaving()) {
        this.hasChanges.set(true);
      }
    });
  }

  private loadData(): void {
    const section = this.contactSection();
    
    this.contactForm.patchValue({
      enabled: section.enabled,
      title: section.title,
      subtitle: section.subtitle || '',
      email: section.email || '',
      phone: section.phone || '',
      whatsapp: section.whatsapp || '',
      address: section.address || '',
      scheduleText: section.scheduleText || ''
    }, { emitEvent: false });

    this.hasChanges.set(false);
  }

  // ==================== SECTION TOGGLE ====================

  toggleSection(): void {
    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    const currentValue = this.contactForm.get('enabled')?.value;
    const newEnabledValue = !currentValue;

    // Actualizar form temporalmente
    this.contactForm.patchValue({ enabled: newEnabledValue }, { emitEvent: false });
    this.isSaving.set(true);

    // ✅ GUARDAR INMEDIATAMENTE
    const formValue = this.contactForm.value;

    const sectionUpdates: UpdateContactSectionDto = {
      enabled: newEnabledValue,
      title: formValue.title?.trim(),
      subtitle: formValue.subtitle?.trim() || undefined,
      email: formValue.email?.trim() || undefined,
      phone: formValue.phone?.trim() || undefined,
      whatsapp: formValue.whatsapp?.trim() || undefined,
      address: formValue.address?.trim() || undefined,
      scheduleText: formValue.scheduleText?.trim() || undefined
    };

    this.settingsApi.updateContactSection(tenant.tenantId, sectionUpdates).subscribe({
      next: (updatedSection) => {
        this.settingsState.updateContactSection(updatedSection);
        this.isSaving.set(false);
        this.showSuccess(
          newEnabledValue 
            ? 'Sección de Contacto activada' 
            : 'Sección de Contacto desactivada'
        );
        this.loadData(); // Recargar datos del state
      },
      error: (error) => {
        console.error('Error al actualizar sección:', error);
        // ✅ REVERTIR cambio si falla
        this.contactForm.patchValue({ enabled: currentValue }, { emitEvent: false });
        this.isSaving.set(false);
        this.showError('Error al actualizar la sección. Intenta nuevamente.');
      }
    });
  }

  // ==================== SAVE / CANCEL ====================

  save(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    // Validaciones adicionales
    const formValue = this.contactForm.value;
    const email = formValue.email?.trim();
    const phone = formValue.phone?.trim();
    const whatsapp = formValue.whatsapp?.trim();

    // Validar email
    if (email && !this.isValidEmail(email)) {
      this.showError('El email no es válido');
      return;
    }

    // Validar teléfono
    if (phone && !this.isValidPhone(phone)) {
      this.showError('El teléfono debe tener al menos 10 dígitos');
      return;
    }

    // Validar WhatsApp
    if (whatsapp && !this.isValidPhone(whatsapp)) {
      this.showError('El número de WhatsApp debe tener al menos 10 dígitos');
      return;
    }

    // Si está habilitado, debe tener al menos un método de contacto
    if (formValue.enabled && !email && !phone && !whatsapp) {
      this.showError('Debes proporcionar al menos un método de contacto (email, teléfono o WhatsApp)');
      return;
    }

    this.saveToApi(tenant.tenantId, formValue);
  }

  private saveToApi(tenantId: string, formValue: any): void {
    this.isSaving.set(true);
    this.clearMessages();

    const sectionUpdates: UpdateContactSectionDto = {
      enabled: formValue.enabled,
      title: formValue.title?.trim(),
      subtitle: formValue.subtitle?.trim() || undefined,
      email: formValue.email?.trim() || undefined,
      phone: formValue.phone?.trim() || undefined,
      whatsapp: formValue.whatsapp?.trim() || undefined,
      address: formValue.address?.trim() || undefined,
      scheduleText: formValue.scheduleText?.trim() || undefined
    };

    this.settingsApi.updateContactSection(tenantId, sectionUpdates).subscribe({
      next: (updatedSection) => {
        this.settingsState.updateContactSection(updatedSection);
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.showSuccess('Sección de Contacto actualizada correctamente');
        this.loadData(); // ✅ AGREGAR: Recargar datos
      },
      error: (error) => {
        console.error('Error al guardar cambios:', error);
        this.isSaving.set(false);
        this.showError('Error al guardar los cambios. Intenta nuevamente.');
      }
    });
  }

  cancel(): void {
    if (this.hasChanges() && !confirm('¿Descartar los cambios realizados?')) {
      return;
    }

    this.loadData();
    this.clearMessages();
  }

  // ==================== VALIDATIONS ====================

  isValidEmail(email: string): boolean {
    if (!email.trim()) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    if (!phone.trim()) return true;
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
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

  // Form getters
  get enabled() { return this.contactForm.get('enabled'); }
  get title() { return this.contactForm.get('title'); }
  get subtitle() { return this.contactForm.get('subtitle'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get whatsapp() { return this.contactForm.get('whatsapp'); }
  get address() { return this.contactForm.get('address'); }
  get scheduleText() { return this.contactForm.get('scheduleText'); }
}