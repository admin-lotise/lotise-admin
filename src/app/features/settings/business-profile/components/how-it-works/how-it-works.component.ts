import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsStateService } from '../../../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../../../core/http/settings-api.service';
import { StorageService } from '../../../../../core/auth/storage.service';
import { HowItWorksStep, CreateHowItWorksStepDto, UpdateHowItWorksStepDto } from '../../../../../shared/models/settings.model';

interface StepForm {
  id: string;
  order: number;
  icon: string;
  title: string;
  description: string;
  isEditing: boolean;
}

/**
 * Componente para gestión de la sección "Cómo Funciona"
 */
@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss'
})
export class HowItWorksComponent implements OnInit {
  // Services
  private readonly settingsState = inject(SettingsStateService);
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);

  // State
  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  
  // Section config
  readonly enabled = signal<boolean>(true);
  readonly sectionTitle = signal<string>('¿Cómo Funciona?');
  readonly sectionSubtitle = signal<string>('');
  
  // Steps
  readonly steps = signal<StepForm[]>([]);
  readonly hasChanges = signal<boolean>(false);
  
  // New step form
  readonly showNewStepForm = signal<boolean>(false);
  newStep: StepForm = this.createEmptyStep();

  // Icon picker
  readonly showIconPicker = signal<boolean>(false);
  readonly currentEditingStepId = signal<string | null>(null);
  
  // Available icons
  readonly availableIcons = [
    { class: 'fas fa-search', label: 'Buscar' },
    { class: 'fas fa-shopping-cart', label: 'Carrito' },
    { class: 'fas fa-ticket-alt', label: 'Boleto' },
    { class: 'fas fa-credit-card', label: 'Pago' },
    { class: 'fas fa-clock', label: 'Reloj' },
    { class: 'fas fa-trophy', label: 'Trofeo' },
    { class: 'fas fa-gift', label: 'Regalo' },
    { class: 'fas fa-check-circle', label: 'Check' },
    { class: 'fas fa-star', label: 'Estrella' },
    { class: 'fas fa-heart', label: 'Corazón' },
    { class: 'fas fa-thumbs-up', label: 'Me gusta' },
    { class: 'fas fa-share-alt', label: 'Compartir' },
    { class: 'fas fa-envelope', label: 'Email' },
    { class: 'fas fa-phone', label: 'Teléfono' },
    { class: 'fas fa-map-marker-alt', label: 'Ubicación' },
    { class: 'fas fa-calendar-alt', label: 'Calendario' },
    { class: 'fas fa-bell', label: 'Campana' },
    { class: 'fas fa-user', label: 'Usuario' },
    { class: 'fas fa-users', label: 'Usuarios' },
    { class: 'fas fa-chart-line', label: 'Gráfica' }
  ];

  // Computed
  readonly howItWorksSection = computed(() => this.settingsState.bioPage().howItWorks);

  ngOnInit(): void {
    this.loadData();
  }

  // ==================== DATA LOADING ====================

  private loadData(): void {
    const section = this.howItWorksSection();
    this.enabled.set(section.enabled);
    this.sectionTitle.set(section.title);
    this.sectionSubtitle.set(section.subtitle || '');
    
    this.steps.set(
      section.steps.map(step => ({
        ...step,
        isEditing: false
      }))
    );
    
    this.hasChanges.set(false);
  }

  private createEmptyStep(): StepForm {
    return {
      id: crypto.randomUUID(),
      order: this.steps().length + 1,
      icon: 'fas fa-star',
      title: '',
      description: '',
      isEditing: false
    };
  }

  // ==================== SECTION TOGGLE ====================

  toggleEnabled(): void {
    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    const newEnabledValue = !this.enabled();
    this.enabled.set(newEnabledValue);

    // ✅ GUARDAR INMEDIATAMENTE
    const sectionUpdates = {
      enabled: newEnabledValue,
      title: this.sectionTitle().trim(),
      subtitle: this.sectionSubtitle().trim() || undefined,
      steps: this.steps().map(({ isEditing, ...step }) => step)
    };

    this.settingsApi.updateHowItWorksSection(tenant.tenantId, sectionUpdates).subscribe({
      next: (updatedSection) => {
        this.settingsState.updateHowItWorksSection(updatedSection);
        this.showSuccess(
          newEnabledValue 
            ? 'Sección "Cómo Funciona" activada' 
            : 'Sección "Cómo Funciona" desactivada'
        );
      },
      error: (error) => {
        console.error('Error al actualizar sección:', error);
        // ✅ REVERTIR cambio si falla
        this.enabled.set(!newEnabledValue);
        this.showError('Error al actualizar la sección. Intenta nuevamente.');
      }
    });
  }

  onFieldChange(): void {
    this.hasChanges.set(true);
  }

  // ==================== STEP CRUD ====================

  showAddStepForm(): void {
    this.newStep = this.createEmptyStep();
    this.showNewStepForm.set(true);
  }

  cancelNewStep(): void {
    this.showNewStepForm.set(false);
    this.newStep = this.createEmptyStep();
  }

  addStep(): void {
    if (!this.validateStep(this.newStep)) return;

    this.steps.update(current => [...current, { ...this.newStep }]);
    this.showNewStepForm.set(false);
    this.newStep = this.createEmptyStep();
    this.hasChanges.set(true);
  }

  editStep(stepId: string): void {
    this.steps.update(current =>
      current.map(s => ({
        ...s,
        isEditing: s.id === stepId
      }))
    );
  }

  cancelEdit(stepId: string): void {
    this.loadData();
  }

  saveStepEdit(stepId: string): void {
    const step = this.steps().find(s => s.id === stepId);
    if (!step || !this.validateStep(step)) return;

    this.steps.update(current =>
      current.map(s => ({
        ...s,
        isEditing: false
      }))
    );
    this.hasChanges.set(true);
  }

  deleteStep(stepId: string): void {
    if (!confirm('¿Estás seguro de eliminar este paso?')) return;

    this.steps.update(current => 
      current
        .filter(s => s.id !== stepId)
        .map((s, index) => ({ ...s, order: index + 1 }))
    );
    this.hasChanges.set(true);
  }

  private validateStep(step: StepForm): boolean {
    if (!step.title.trim()) {
      this.showError('El título del paso es obligatorio');
      return false;
    }
    if (!step.description.trim()) {
      this.showError('La descripción del paso es obligatoria');
      return false;
    }
    return true;
  }

  // ==================== ICON PICKER ====================

  openIconPicker(stepId: string | null = null): void {
    this.currentEditingStepId.set(stepId);
    this.showIconPicker.set(true);
  }

  selectIcon(iconClass: string): void {
    const stepId = this.currentEditingStepId();
    
    if (stepId === null || stepId === 'new') {
      this.newStep.icon = iconClass;
    } else {
      this.steps.update(current =>
        current.map(s => s.id === stepId ? { ...s, icon: iconClass } : s)
      );
      this.hasChanges.set(true);
    }

    this.showIconPicker.set(false);
    this.currentEditingStepId.set(null);
  }

  closeIconPicker(): void {
    this.showIconPicker.set(false);
    this.currentEditingStepId.set(null);
  }

  // ==================== SAVE / CANCEL ====================

  save(): void {
    const tenant = this.storageService.getTenant();
    if (!tenant) {
      this.showError('No hay sesión activa');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    const sectionUpdates = {
      enabled: this.enabled(),
      title: this.sectionTitle().trim(),
      subtitle: this.sectionSubtitle().trim() || undefined,
      steps: this.steps().map(({ isEditing, ...step }) => step)
    };

    this.settingsApi.updateHowItWorksSection(tenant.tenantId, sectionUpdates).subscribe({
      next: (updatedSection) => {
        this.settingsState.updateHowItWorksSection(updatedSection);
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.showSuccess('Sección "Cómo Funciona" actualizada correctamente');
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
    this.showNewStepForm.set(false);
    this.clearMessages();
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
}