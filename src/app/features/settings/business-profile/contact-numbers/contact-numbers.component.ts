import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsStateService } from '../../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../../core/http/settings-api.service';
import { StorageService } from '../../../../core/auth/storage.service';
import { WhatsAppContact } from '../../../../shared/models/settings.model';

/**
 * Componente para gestión CRUD de contactos WhatsApp
 * Permite agregar, editar y eliminar números de contacto
 */
@Component({
  selector: 'app-contact-numbers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-numbers.component.html',
  styleUrl: './contact-numbers.component.scss'
})
export class ContactNumbersComponent {
  private readonly fb = inject(FormBuilder);
  private readonly settingsState = inject(SettingsStateService);
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);

  // Signals locales
  readonly isModalOpen = signal(false);
  readonly isEditing = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly editingContactId = signal<string | null>(null);

  // Form reactivo
  contactForm!: FormGroup;

  // Computed: Lista de contactos desde el estado
  readonly contacts = computed(() => this.settingsState.businessProfile().whatsappContacts);

  // Country codes comunes (México y LATAM)
  readonly countryCodes = [
    { code: '+52', country: 'México', flag: '🇲🇽' },
    { code: '+1', country: 'USA/Canadá', flag: '🇺🇸' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+51', country: 'Perú', flag: '🇵🇪' },
    { code: '+55', country: 'Brasil', flag: '🇧🇷' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
    { code: '+504', country: 'Honduras', flag: '🇭🇳' },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
    { code: '+507', country: 'Panamá', flag: '🇵🇦' },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
    { code: '+34', country: 'España', flag: '🇪🇸' }
  ];

  constructor() {
    this.initializeForm();
  }

  /**
   * Inicializar formulario
   */
  private initializeForm(): void {
    this.contactForm = this.fb.group({
      countryCode: ['+52', [Validators.required]],
      number: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{10}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      useForReservations: [true],
      visibleOnWeb: [true]
    });
  }

  /**
   * Abrir modal para nuevo contacto
   */
  openNewContactModal(): void {
    this.isEditing.set(false);
    this.editingContactId.set(null);
    this.contactForm.reset({
      countryCode: '+52',
      number: '',
      useForReservations: true,
      visibleOnWeb: true
    });
    this.isModalOpen.set(true);
    this.clearMessages();
  }

  /**
   * Abrir modal para editar contacto
   */
  openEditContactModal(contact: WhatsAppContact): void {
    this.isEditing.set(true);
    this.editingContactId.set(contact.id);
    this.contactForm.patchValue({
      countryCode: contact.countryCode,
      number: contact.number,
      useForReservations: contact.useForReservations,
      visibleOnWeb: contact.visibleOnWeb
    });
    this.isModalOpen.set(true);
    this.clearMessages();
  }

  /**
   * Cerrar modal
   */
  closeModal(): void {
    this.isModalOpen.set(false);
    this.isEditing.set(false);
    this.editingContactId.set(null);
    this.contactForm.reset();
  }

  /**
   * Guardar contacto (crear o actualizar)
   */
  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    const formValue = this.contactForm.value;
    const contactData = {
      countryCode: formValue.countryCode,
      number: formValue.number,
      useForReservations: formValue.useForReservations,
      visibleOnWeb: formValue.visibleOnWeb
    };

    if (this.isEditing()) {
      // Actualizar contacto existente
      const contactId = this.editingContactId()!;
      this.settingsApi.updateWhatsAppContact(tenant.tenantId, contactId, contactData).subscribe({
        next: (updatedContact) => {
          this.settingsState.updateWhatsAppContact(contactId, updatedContact);
          this.isSaving.set(false);
          this.showSuccess('Contacto actualizado correctamente');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar contacto:', error);
          this.isSaving.set(false);
          this.showError('Error al actualizar el contacto. Intenta nuevamente.');
        }
      });
    } else {
      // Crear nuevo contacto
      this.settingsApi.createWhatsAppContact(tenant.tenantId, contactData).subscribe({
        next: (newContact) => {
          this.settingsState.addWhatsAppContact(newContact);
          this.isSaving.set(false);
          this.showSuccess('Contacto agregado correctamente');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear contacto:', error);
          this.isSaving.set(false);
          this.showError('Error al agregar el contacto. Intenta nuevamente.');
        }
      });
    }
  }

  /**
   * Eliminar contacto
   */
  deleteContact(contact: WhatsAppContact): void {
    if (!confirm(`¿Estás seguro de eliminar el contacto ${contact.countryCode} ${contact.number}?`)) {
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isDeleting.set(contact.id);
    this.clearMessages();

    this.settingsApi.deleteWhatsAppContact(tenant.tenantId, contact.id).subscribe({
      next: () => {
        this.settingsState.deleteWhatsAppContact(contact.id);
        this.isDeleting.set(null);
        this.showSuccess('Contacto eliminado correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar contacto:', error);
        this.isDeleting.set(null);
        this.showError('Error al eliminar el contacto. Intenta nuevamente.');
      }
    });
  }

  /**
   * Formatear número para mostrar en WhatsApp
   */
  getWhatsAppLink(contact: WhatsAppContact): string {
    const cleanNumber = contact.number.replace(/\D/g, '');
    const fullNumber = contact.countryCode.replace('+', '') + cleanNumber;
    return `https://wa.me/${fullNumber}`;
  }

  /**
   * Formatear número para display
   */
  formatPhoneNumber(number: string): string {
    // Formato: (XXX) XXX-XXXX para números de 10 dígitos
    if (number.length === 10) {
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
    return number;
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
  get countryCode() { return this.contactForm.get('countryCode'); }
  get number() { return this.contactForm.get('number'); }
  get useForReservations() { return this.contactForm.get('useForReservations'); }
  get visibleOnWeb() { return this.contactForm.get('visibleOnWeb'); }
}