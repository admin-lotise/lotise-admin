import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsStateService } from '../../../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../../../core/http/settings-api.service';
import { StorageService } from '../../../../../core/auth/storage.service';
import { Testimonial } from '../../../../../shared/models/settings.model';

interface TestimonialForm {
  id: string;
  order: number;
  name: string; // ✅ CAMBIADO de "author" a "name"
  message: string; // ✅ CAMBIADO de "text" a "message"
  rating: number;
  isEditing: boolean;
}

/**
 * Componente para gestión de la sección de Testimonios
 */
@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {
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
  readonly sectionTitle = signal<string>('Testimonios');
  readonly sectionSubtitle = signal<string>('');
  
  // Testimonials
  readonly testimonials = signal<TestimonialForm[]>([]);
  readonly hasChanges = signal<boolean>(false);
  
  // New testimonial form
  readonly showNewTestimonialForm = signal<boolean>(false);
  readonly newTestimonial = signal<TestimonialForm>(this.createEmptyTestimonial()); // ✅ CAMBIADO a signal

  // Rating stars
  readonly maxRating = 5;
  readonly stars = Array.from({ length: this.maxRating }, (_, i) => i + 1);

  // Computed
  readonly testimonialsSection = computed(() => this.settingsState.bioPage().testimonials);

  ngOnInit(): void {
    this.loadData();
  }

  // ==================== DATA LOADING ====================

  private loadData(): void {
    const section = this.testimonialsSection();
    this.enabled.set(section.enabled);
    this.sectionTitle.set(section.title);
    this.sectionSubtitle.set(section.subtitle || '');
    
    this.testimonials.set(
      section.items.map((testimonial: Testimonial) => ({
        id: testimonial.id,
        order: testimonial.order,
        name: testimonial.name,
        message: testimonial.message,
        rating: testimonial.rating,
        isEditing: false
      }))
    );

    this.hasChanges.set(false);
  }

  private createEmptyTestimonial(): TestimonialForm {
    return {
      id: crypto.randomUUID(),
      order: this.testimonials().length + 1,
      name: '',
      message: '',
      rating: 5,
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
    const items: Testimonial[] = this.testimonials().map(({ isEditing, ...rest }) => rest);

    const sectionUpdates = {
      enabled: newEnabledValue,
      title: this.sectionTitle().trim(),
      subtitle: this.sectionSubtitle().trim() || undefined,
      items
    };

    this.settingsApi.updateTestimonialsSection(tenant.tenantId, sectionUpdates).subscribe({
      next: (updatedSection) => {
        this.settingsState.updateTestimonialsSection(updatedSection);
        this.showSuccess(
          newEnabledValue 
            ? 'Sección de Testimonios activada' 
            : 'Sección de Testimonios desactivada'
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

  // ==================== TESTIMONIAL CRUD ====================

  showAddTestimonialForm(): void {
    this.newTestimonial.set(this.createEmptyTestimonial()); // ✅ CAMBIADO
    this.showNewTestimonialForm.set(true);
  }

  cancelNewTestimonial(): void {
    this.showNewTestimonialForm.set(false);
    this.newTestimonial.set(this.createEmptyTestimonial()); // ✅ CAMBIADO
  }

  addTestimonial(): void {
    const testimonial = this.newTestimonial(); // ✅ AGREGAR
    if (!this.validateTestimonial(testimonial)) return;

    this.testimonials.update(current => [...current, { ...testimonial }]); // ✅ CAMBIADO
    this.showNewTestimonialForm.set(false);
    this.newTestimonial.set(this.createEmptyTestimonial()); // ✅ CAMBIADO
    this.hasChanges.set(true);
  }

  editTestimonial(testimonialId: string): void {
    this.testimonials.update(current =>
      current.map(t => ({
        ...t,
        isEditing: t.id === testimonialId
      }))
    );
  }

  cancelEdit(testimonialId: string): void {
    this.loadData();
  }

  saveTestimonialEdit(testimonialId: string): void {
    const testimonial = this.testimonials().find(t => t.id === testimonialId);
    if (!testimonial || !this.validateTestimonial(testimonial)) return;

    this.testimonials.update(current =>
      current.map(t => ({
        ...t,
        isEditing: false
      }))
    );
    this.hasChanges.set(true);
  }

  deleteTestimonial(testimonialId: string): void {
    if (!confirm('¿Estás seguro de eliminar este testimonial?')) return;

    this.testimonials.update(current => 
      current
        .filter(t => t.id !== testimonialId)
        .map((t, index) => ({ ...t, order: index + 1 }))
    );
    this.hasChanges.set(true);
  }

  private validateTestimonial(testimonial: TestimonialForm): boolean {
    if (!testimonial.name || !testimonial.name.trim()) { // ✅ MEJORADO
      this.showError('El nombre del cliente es obligatorio');
      return false;
    }
    if (!testimonial.message || !testimonial.message.trim()) { // ✅ MEJORADO
      this.showError('El mensaje del testimonial es obligatorio');
      return false;
    }
    if (testimonial.rating < 1 || testimonial.rating > 5) {
      this.showError('La calificación debe estar entre 1 y 5 estrellas');
      return false;
    }
    return true;
  }

  // ==================== RATING ====================

  setRating(testimonial: TestimonialForm, rating: number): void {
    testimonial.rating = rating;
    this.hasChanges.set(true); // ✅ AGREGAR
  }

  setNewRating(rating: number): void {
    this.newTestimonial.update(current => ({ ...current, rating }));
  }

  // ✅ AGREGAR: Métodos para actualizar newTestimonial
  updateNewTestimonialName(name: string): void {
    this.newTestimonial.update(current => ({ ...current, name }));
  }

  updateNewTestimonialMessage(message: string): void {
    this.newTestimonial.update(current => ({ ...current, message }));
  }

  getStars(rating: number): boolean[] {
    return this.stars.map(star => star <= rating);
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

    const items: Testimonial[] = this.testimonials().map(({ isEditing, ...rest }) => rest);

    const sectionUpdates = {
      enabled: this.enabled(),
      title: this.sectionTitle().trim(),
      subtitle: this.sectionSubtitle().trim() || undefined,
      items
    };

    this.settingsApi.updateTestimonialsSection(tenant.tenantId, sectionUpdates).subscribe({
      next: (updatedSection) => {
        this.settingsState.updateTestimonialsSection(updatedSection);
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.showSuccess('Sección de Testimonios actualizada correctamente');
        this.loadData();
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
    this.showNewTestimonialForm.set(false);
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