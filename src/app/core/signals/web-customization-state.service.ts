import { Injectable, signal, computed } from '@angular/core';
import { WebCustomization, DEFAULT_WEB_CUSTOMIZATION } from '../../shared/models/web-customization.model';

@Injectable({
  providedIn: 'root'
})
export class WebCustomizationStateService {
  // Signal privado para la personalización
  private readonly _customization = signal<WebCustomization>({
    tenantId: '',
    ...DEFAULT_WEB_CUSTOMIZATION,
    updatedAt: new Date()
  } as WebCustomization);

  // Signal público (readonly)
  readonly customization = this._customization.asReadonly();

  // Computed signals útiles
  readonly colors = computed(() => ({
    primary: this._customization().primaryColor,
    primaryContrast: this._customization().primaryContrast,
    secondary: this._customization().secondaryColor,
    secondaryContrast: this._customization().secondaryContrast
  }));

  readonly features = computed(() => ({
    showTicketVerifier: this._customization().showTicketVerifier,
    showParticipantsList: this._customization().showParticipantsList,
    showTimer: this._customization().showTimer,
    showSoldTickets: this._customization().showSoldTickets,
    showPrivacyPolicy: this._customization().showPrivacyPolicy,
    showTermsConditions: this._customization().showTermsConditions,
    openWhatsAppDirect: this._customization().openWhatsAppDirect,
    allowSocialShare: this._customization().allowSocialShare,
    showPreviousWinners: this._customization().showPreviousWinners
  }));

  /**
   * Establecer personalización completa
   */
  setCustomization(customization: WebCustomization): void {
    this._customization.set(customization);
  }

  /**
   * Actualizar personalización parcialmente
   */
  updateCustomization(updates: Partial<WebCustomization>): void {
    this._customization.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar solo colores
   */
  updateColors(colors: {
    primaryColor?: string;
    primaryContrast?: string;
    secondaryColor?: string;
    secondaryContrast?: string;
  }): void {
    this._customization.update(current => ({
      ...current,
      ...colors,
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar solo funcionalidades
   */
  updateFeatures(features: Partial<WebCustomization>): void {
    this._customization.update(current => ({
      ...current,
      ...features,
      updatedAt: new Date()
    }));
  }

  /**
   * Resetear a valores por defecto
   */
  resetToDefaults(): void {
    this._customization.update(current => ({
      ...current,
      ...DEFAULT_WEB_CUSTOMIZATION,
      updatedAt: new Date()
    }));
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._customization.set({
      tenantId: '',
      ...DEFAULT_WEB_CUSTOMIZATION,
      updatedAt: new Date()
    } as WebCustomization);
  }
}