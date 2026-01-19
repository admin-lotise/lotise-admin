import { Component, signal, inject, computed, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; // ✅ AGREGAR FormControl
import { SettingsStateService } from '../../../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../../../core/http/settings-api.service';
import { StorageService } from '../../../../../core/auth/storage.service';
import { FaqItem, FaqCategory, CreateFaqDto, UpdateFaqDto } from '../../../../../shared/models/settings.model';

/**
 * Interfaz para el formulario de FAQ
 */
interface FAQForm {
  question: string;
  answer: string;
  category: FaqCategory;
}

/**
 * Componente para gestión de FAQs (Preguntas Frecuentes)
 */
@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly settingsState = inject(SettingsStateService);
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);

  // ==================== SIGNALS ====================
  readonly isModalOpen = signal(false);
  readonly isEditing = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal<string | null>(null);
  readonly editingFaqId = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // ==================== COMPUTED ====================
  readonly faqsSection = computed(() => this.settingsState.bioPage().faqs);
  readonly faqs = computed(() => this.faqsSection().items);
  readonly isSectionEnabled = computed(() => this.faqsSection().enabled);

  // ==================== FORM ====================
  // ✅ CORREGIDO: Tipos explícitos de FormControl
  faqForm!: FormGroup<{
    question: FormControl<string | null>;
    answer: FormControl<string | null>;
    category: FormControl<FaqCategory | null>;
  }>;

  // ==================== CATEGORIES ====================
  readonly categories = [
    { value: FaqCategory.GENERAL, label: 'General', icon: 'fas fa-info-circle' },
    { value: FaqCategory.RAFFLES, label: 'Rifas', icon: 'fas fa-ticket-alt' },
    { value: FaqCategory.PAYMENTS, label: 'Pagos', icon: 'fas fa-credit-card' },
    { value: FaqCategory.TICKETS, label: 'Boletos', icon: 'fas fa-receipt' },
    { value: FaqCategory.WINNERS, label: 'Ganadores', icon: 'fas fa-trophy' },
    { value: FaqCategory.ACCOUNT, label: 'Cuenta', icon: 'fas fa-user-circle' }
  ];

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Componente reactivo, no necesita lógica adicional en ngOnInit
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

  // ==================== FORM INITIALIZATION ====================

  private initializeForm(): void {
    this.faqForm = this.fb.group({
      question: this.fb.control<string | null>('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
      answer: this.fb.control<string | null>('', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
      category: this.fb.control<FaqCategory | null>(FaqCategory.GENERAL, [Validators.required])
    }) as FormGroup<{
      question: FormControl<string | null>;
      answer: FormControl<string | null>;
      category: FormControl<FaqCategory | null>;
    }>;
  }

  // ==================== MODAL MANAGEMENT ====================

  openNewFaqModal(): void {
    this.isEditing.set(false);
    this.editingFaqId.set(null);
    this.faqForm.reset({
      question: '',
      answer: '',
      category: FaqCategory.GENERAL
    });
    this.isModalOpen.set(true);
    this.lockBodyScroll();
    this.clearMessages();
  }

  openEditFaqModal(faq: FaqItem): void {
    this.isEditing.set(true);
    this.editingFaqId.set(faq.id);
    this.faqForm.patchValue({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || FaqCategory.GENERAL
    });
    this.isModalOpen.set(true);
    this.lockBodyScroll();
    this.clearMessages();
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.isEditing.set(false);
    this.editingFaqId.set(null);
    this.faqForm.reset();
    this.unlockBodyScroll();
  }

  // ==================== CRUD OPERATIONS ====================

  onSubmit(): void {
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    const formValue = this.faqForm.value;

    if (this.isEditing()) {
      this.updateFaq(tenant.tenantId, formValue as FAQForm);
    } else {
      this.createFaq(tenant.tenantId, formValue as FAQForm);
    }
  }

  private createFaq(tenantId: string, formValue: FAQForm): void {
    const currentFaqs = this.faqs();
    const newOrder = currentFaqs.length > 0 
      ? Math.max(...currentFaqs.map(f => f.order)) + 1 
      : 1;

    const faqData: CreateFaqDto = {
      order: newOrder,
      question: formValue.question,
      answer: formValue.answer,
      category: formValue.category
    };

    this.settingsApi.createFaq(tenantId, faqData).subscribe({
      next: (newFaq) => {
        this.settingsState.addFaq(newFaq);
        this.isSaving.set(false);
        this.showSuccess('Pregunta agregada correctamente');
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear FAQ:', error);
        this.isSaving.set(false);
        this.showError('Error al agregar la pregunta. Intenta nuevamente.');
      }
    });
  }

  private updateFaq(tenantId: string, formValue: FAQForm): void {
    const faqId = this.editingFaqId()!;
    const currentFaq = this.faqs().find(f => f.id === faqId);

    const updateData: UpdateFaqDto = {
      question: formValue.question,
      answer: formValue.answer,
      category: formValue.category,
      order: currentFaq?.order
    };

    this.settingsApi.updateFaq(tenantId, faqId, updateData).subscribe({
      next: (updatedFaq) => {
        this.settingsState.updateFaq(faqId, updatedFaq);
        this.isSaving.set(false);
        this.showSuccess('Pregunta actualizada correctamente');
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar FAQ:', error);
        this.isSaving.set(false);
        this.showError('Error al actualizar la pregunta. Intenta nuevamente.');
      }
    });
  }

  deleteFaq(faq: FaqItem): void {
    if (!confirm(`¿Estás seguro de eliminar la pregunta "${faq.question}"?`)) {
      return;
    }

    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isDeleting.set(faq.id);
    this.clearMessages();

    this.settingsApi.deleteFaq(tenant.tenantId, faq.id).subscribe({
      next: () => {
        this.settingsState.deleteFaq(faq.id);
        this.isDeleting.set(null);
        this.showSuccess('Pregunta eliminada correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar FAQ:', error);
        this.isDeleting.set(null);
        this.showError('Error al eliminar la pregunta. Intenta nuevamente.');
      }
    });
  }

  // ==================== SECTION TOGGLE ====================

  toggleSection(): void {
    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    const currentSection = this.faqsSection();
    const updatedSection = {
      ...currentSection,
      enabled: !currentSection.enabled
    };

    this.settingsApi.updateFaqsSection(tenant.tenantId, updatedSection).subscribe({
      next: (section) => {
        this.settingsState.updateFaqsSection(section);
        this.showSuccess(
          section.enabled 
            ? 'Sección de preguntas frecuentes activada' 
            : 'Sección de preguntas frecuentes desactivada'
        );
      },
      error: (error) => {
        console.error('Error al actualizar sección:', error);
        this.showError('Error al actualizar la sección. Intenta nuevamente.');
      }
    });
  }

  // ==================== HELPERS ====================

  getCategoryLabel(category?: FaqCategory): string {
    if (!category) return 'General';
    const cat = this.categories.find(c => c.value === category);
    return cat?.label || 'General';
  }

  getCategoryIcon(category?: FaqCategory): string {
    if (!category) return 'fas fa-info-circle';
    const cat = this.categories.find(c => c.value === category);
    return cat?.icon || 'fas fa-info-circle';
  }

  private lockBodyScroll(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
  }

  private unlockBodyScroll(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  private getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  }

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

  // ✅ Form getters con tipos correctos
  get category() { return this.faqForm.controls.question; }
  get question() { return this.faqForm.controls.question; }
  get answer() { return this.faqForm.controls.answer; }
}