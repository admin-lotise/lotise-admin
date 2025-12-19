import { Injectable, signal, computed } from '@angular/core';
import { LegalContent } from '../../shared/models/legal-content.model';

@Injectable({
  providedIn: 'root'
})
export class LegalContentStateService {
  // Signal privado para el contenido legal
  private readonly _legalContent = signal<LegalContent>({
    tenantId: '',
    privacyPolicyHtml: '',
    privacyPolicyLastUpdate: new Date(),
    termsConditionsHtml: '',
    termsConditionsLastUpdate: new Date(),
    updatedAt: new Date()
  });

  // Signal público (readonly)
  readonly legalContent = this._legalContent.asReadonly();

  // Computed signals útiles
  readonly hasPrivacyPolicy = computed(() => 
    this._legalContent().privacyPolicyHtml.length > 0
  );

  readonly hasTermsConditions = computed(() => 
    this._legalContent().termsConditionsHtml.length > 0
  );

  readonly privacyPolicy = computed(() => ({
    html: this._legalContent().privacyPolicyHtml,
    lastUpdate: this._legalContent().privacyPolicyLastUpdate
  }));

  readonly termsConditions = computed(() => ({
    html: this._legalContent().termsConditionsHtml,
    lastUpdate: this._legalContent().termsConditionsLastUpdate
  }));

  /**
   * Establecer contenido legal completo
   */
  setLegalContent(content: LegalContent): void {
    this._legalContent.set(content);
  }

  /**
   * Actualizar aviso de privacidad
   */
  updatePrivacyPolicy(html: string): void {
    this._legalContent.update(current => ({
      ...current,
      privacyPolicyHtml: html,
      privacyPolicyLastUpdate: new Date(),
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar términos y condiciones
   */
  updateTermsConditions(html: string): void {
    this._legalContent.update(current => ({
      ...current,
      termsConditionsHtml: html,
      termsConditionsLastUpdate: new Date(),
      updatedAt: new Date()
    }));
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._legalContent.set({
      tenantId: '',
      privacyPolicyHtml: '',
      privacyPolicyLastUpdate: new Date(),
      termsConditionsHtml: '',
      termsConditionsLastUpdate: new Date(),
      updatedAt: new Date()
    });
  }
}