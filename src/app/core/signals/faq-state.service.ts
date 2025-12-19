import { Injectable, signal, computed } from '@angular/core';
import { FAQ } from '../../shared/models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FAQStateService {
  // Signal privado para las FAQs
  private readonly _faqs = signal<FAQ[]>([]);

  // Signal público (readonly)
  readonly faqs = this._faqs.asReadonly();

  // Computed signals útiles
  readonly activeFaqs = computed(() => 
    this._faqs().filter(faq => faq.isActive).sort((a, b) => a.order - b.order)
  );

  readonly totalFaqs = computed(() => this._faqs().length);

  readonly hasActiveFaqs = computed(() => this.activeFaqs().length > 0);

  /**
   * Establecer lista completa de FAQs
   */
  setFaqs(faqs: FAQ[]): void {
    this._faqs.set(faqs);
  }

  /**
   * Agregar nueva FAQ
   */
  addFaq(faq: FAQ): void {
    this._faqs.update(faqs => [...faqs, faq]);
  }

  /**
   * Actualizar FAQ existente
   */
  updateFaq(id: string, updates: Partial<FAQ>): void {
    this._faqs.update(faqs =>
      faqs.map(faq => faq.id === id ? { ...faq, ...updates, updatedAt: new Date() } : faq)
    );
  }

  /**
   * Eliminar FAQ
   */
  deleteFaq(id: string): void {
    this._faqs.update(faqs => faqs.filter(faq => faq.id !== id));
  }

  /**
   * Reordenar FAQs
   */
  reorderFaqs(orderedIds: string[]): void {
    this._faqs.update(faqs => {
      const faqMap = new Map(faqs.map(faq => [faq.id, faq]));
      return orderedIds
        .map((id, index) => {
          const faq = faqMap.get(id);
          return faq ? { ...faq, order: index } : null;
        })
        .filter((faq): faq is FAQ => faq !== null);
    });
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._faqs.set([]);
  }
}