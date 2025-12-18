import { Injectable, signal, computed } from '@angular/core';
import { BusinessProfile, WhatsAppContact, SocialMedia } from '../../shared/models/settings.model';

/**
 * Servicio de estado global para configuración con Angular Signals
 * Maneja el estado reactivo de toda la configuración del tenant
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsStateService {
  
  // ==================== BUSINESS PROFILE STATE ====================
  
  /**
   * Estado del perfil del negocio
   */
  private readonly _businessProfile = signal<BusinessProfile>({
    businessName: '',
    aboutUs: '',
    logoUrl: null,
    whatsappContacts: [],
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      tiktok: ''
    }
  });

  /**
   * Señal de carga para Business Profile
   */
  private readonly _isLoadingBusinessProfile = signal<boolean>(false);

  /**
   * Señal de error para Business Profile
   */
  private readonly _businessProfileError = signal<string | null>(null);

  // ==================== COMPUTED SIGNALS ====================

  /**
   * Business Profile (read-only)
   */
  readonly businessProfile = this._businessProfile.asReadonly();

  /**
   * Estado de carga
   */
  readonly isLoadingBusinessProfile = this._isLoadingBusinessProfile.asReadonly();

  /**
   * Error actual
   */
  readonly businessProfileError = this._businessProfileError.asReadonly();

  /**
   * Indica si hay datos guardados (computed)
   */
  readonly hasBusinessProfileData = computed(() => {
    const profile = this._businessProfile();
    return profile.businessName.length > 0 || 
           profile.aboutUs.length > 0 || 
           profile.logoUrl !== null;
  });

  /**
   * Cantidad de contactos de WhatsApp (computed)
   */
  readonly whatsappContactsCount = computed(() => {
    return this._businessProfile().whatsappContacts.length;
  });

  /**
   * Indica si tiene al menos una red social configurada (computed)
   */
  readonly hasSocialMedia = computed(() => {
    const social = this._businessProfile().socialMedia;
    return social.facebook.length > 0 || 
           social.twitter.length > 0 || 
           social.instagram.length > 0 || 
           social.tiktok.length > 0;
  });

  // ==================== ACTIONS ====================

  /**
   * Actualizar perfil completo del negocio
   */
  updateBusinessProfile(profile: BusinessProfile): void {
    this._businessProfile.set(profile);
    this._businessProfileError.set(null);
  }

  /**
   * Actualizar solo datos generales (nombre y nosotros)
   */
  updateGeneralInfo(businessName: string, aboutUs: string): void {
    this._businessProfile.update(current => ({
      ...current,
      businessName,
      aboutUs
    }));
  }

  /**
   * Actualizar logo URL
   */
  updateLogoUrl(logoUrl: string | null): void {
    this._businessProfile.update(current => ({
      ...current,
      logoUrl
    }));
  }

  /**
   * Actualizar contactos de WhatsApp
   */
  updateWhatsAppContacts(contacts: WhatsAppContact[]): void {
    this._businessProfile.update(current => ({
      ...current,
      whatsappContacts: contacts
    }));
  }

  /**
   * Agregar contacto de WhatsApp
   */
  addWhatsAppContact(contact: WhatsAppContact): void {
    this._businessProfile.update(current => ({
      ...current,
      whatsappContacts: [...current.whatsappContacts, contact]
    }));
  }

  /**
   * Actualizar contacto de WhatsApp existente
   */
  updateWhatsAppContact(contactId: string, updatedContact: WhatsAppContact): void {
    this._businessProfile.update(current => ({
      ...current,
      whatsappContacts: current.whatsappContacts.map(contact =>
        contact.id === contactId ? updatedContact : contact
      )
    }));
  }

  /**
   * Eliminar contacto de WhatsApp
   */
  deleteWhatsAppContact(contactId: string): void {
    this._businessProfile.update(current => ({
      ...current,
      whatsappContacts: current.whatsappContacts.filter(contact => contact.id !== contactId)
    }));
  }

  /**
   * Actualizar redes sociales
   */
  updateSocialMedia(socialMedia: SocialMedia): void {
    this._businessProfile.update(current => ({
      ...current,
      socialMedia
    }));
  }

  /**
   * Establecer estado de carga
   */
  setLoadingBusinessProfile(isLoading: boolean): void {
    this._isLoadingBusinessProfile.set(isLoading);
  }

  /**
   * Establecer error
   */
  setBusinessProfileError(error: string | null): void {
    this._businessProfileError.set(error);
  }

  /**
   * Limpiar error
   */
  clearBusinessProfileError(): void {
    this._businessProfileError.set(null);
  }

  /**
   * Resetear estado completo de Business Profile
   */
  resetBusinessProfile(): void {
    this._businessProfile.set({
      businessName: '',
      aboutUs: '',
      logoUrl: null,
      whatsappContacts: [],
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        tiktok: ''
      }
    });
    this._isLoadingBusinessProfile.set(false);
    this._businessProfileError.set(null);
  }
}