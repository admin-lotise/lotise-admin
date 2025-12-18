import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { 
  BusinessProfile, 
  WhatsAppContact, 
  SocialMedia,
  FileUploadRequest,
  FileUploadResponse 
} from '../../shared/models/settings.model';
import { environment } from '../../environments/environment';

/**
 * Servicio para comunicación con API de configuración
 * Por ahora retorna datos mock hasta que el backend esté listo
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || 'https://api.lotise.com';

  // Flag para simular API (cambiar a false cuando backend esté listo)
  private readonly USE_MOCK_DATA = true;

  // ==================== BUSINESS PROFILE ENDPOINTS ====================

  /**
   * Obtener perfil del negocio del tenant
   */
  getBusinessProfile(tenantId: string): Observable<BusinessProfile> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBusinessProfile().pipe(delay(500));
    }

    return this.http.get<BusinessProfile>(
      `${this.apiUrl}/tenants/${tenantId}/settings/business-profile`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar perfil del negocio completo
   */
  updateBusinessProfile(tenantId: string, profile: BusinessProfile): Observable<BusinessProfile> {
    if (this.USE_MOCK_DATA) {
      return of({ ...profile, businessName: profile.businessName }).pipe(delay(800));
    }

    return this.http.put<BusinessProfile>(
      `${this.apiUrl}/tenants/${tenantId}/settings/business-profile`,
      profile
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar solo datos generales (nombre y nosotros)
   */
  updateGeneralInfo(
    tenantId: string, 
    businessName: string, 
    aboutUs: string
  ): Observable<{ success: boolean; message: string }> {
    if (this.USE_MOCK_DATA) {
      return of({ 
        success: true, 
        message: 'Datos generales actualizados correctamente' 
      }).pipe(delay(800));
    }

    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/tenants/${tenantId}/settings/general-info`,
      { businessName, aboutUs }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== WHATSAPP CONTACTS ENDPOINTS ====================

  /**
   * Obtener todos los contactos de WhatsApp
   */
  getWhatsAppContacts(tenantId: string): Observable<WhatsAppContact[]> {
    if (this.USE_MOCK_DATA) {
      return this.getMockWhatsAppContacts().pipe(delay(500));
    }

    return this.http.get<WhatsAppContact[]>(
      `${this.apiUrl}/tenants/${tenantId}/whatsapp-contacts`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear contacto de WhatsApp
   */
  createWhatsAppContact(
    tenantId: string, 
    contact: Omit<WhatsAppContact, 'id' | 'createdAt'>
  ): Observable<WhatsAppContact> {
    if (this.USE_MOCK_DATA) {
      const newContact: WhatsAppContact = {
        ...contact,
        id: `wa-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      return of(newContact).pipe(delay(800));
    }

    return this.http.post<WhatsAppContact>(
      `${this.apiUrl}/tenants/${tenantId}/whatsapp-contacts`,
      contact
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar contacto de WhatsApp
   */
  updateWhatsAppContact(
    tenantId: string, 
    contactId: string, 
    contact: Partial<WhatsAppContact>
  ): Observable<WhatsAppContact> {
    if (this.USE_MOCK_DATA) {
      return of({ ...contact, id: contactId } as WhatsAppContact).pipe(delay(800));
    }

    return this.http.put<WhatsAppContact>(
      `${this.apiUrl}/tenants/${tenantId}/whatsapp-contacts/${contactId}`,
      contact
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar contacto de WhatsApp
   */
  deleteWhatsAppContact(tenantId: string, contactId: string): Observable<{ success: boolean }> {
    if (this.USE_MOCK_DATA) {
      return of({ success: true }).pipe(delay(800));
    }

    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/tenants/${tenantId}/whatsapp-contacts/${contactId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== SOCIAL MEDIA ENDPOINTS ====================

  /**
   * Actualizar redes sociales
   */
  updateSocialMedia(tenantId: string, socialMedia: SocialMedia): Observable<SocialMedia> {
    if (this.USE_MOCK_DATA) {
      return of(socialMedia).pipe(delay(800));
    }

    return this.http.put<SocialMedia>(
      `${this.apiUrl}/tenants/${tenantId}/settings/social-media`,
      socialMedia
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== FILE UPLOAD ENDPOINTS ====================

  /**
   * Subir logo (preparado para S3)
   * Por ahora retorna URL mock, después implementar upload a S3
   */
  uploadLogo(request: FileUploadRequest): Observable<FileUploadResponse> {
    if (this.USE_MOCK_DATA) {
      // Simular URL de S3
      const mockUrl = `https://lotise-assets.s3.amazonaws.com/logos/${request.tenantId}/${Date.now()}-${request.file.name}`;
      return of({ 
        success: true, 
        url: mockUrl,
        message: 'Logo subido correctamente (mock)' 
      }).pipe(delay(1500));
    }

    // Implementación real con S3 (por hacer)
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('tenantId', request.tenantId);
    formData.append('fileType', request.fileType);

    return this.http.post<FileUploadResponse>(
      `${this.apiUrl}/upload/logo`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== MOCK DATA (Desarrollo) ====================

  private getMockBusinessProfile(): Observable<BusinessProfile> {
    return of({
      businessName: 'Rifas El Búfalo',
      aboutUs: '<p>Somos una empresa dedicada a las rifas desde hace más de 10 años...</p>',
      logoUrl: 'https://via.placeholder.com/150',
      whatsappContacts: [],
      socialMedia: {
        facebook: 'https://facebook.com/rifaselbufalo',
        twitter: 'https://twitter.com/rifaselbufalo',
        instagram: 'https://instagram.com/rifaselbufalo',
        tiktok: ''
      }
    });
  }

  private getMockWhatsAppContacts(): Observable<WhatsAppContact[]> {
    return of([
      {
        id: 'wa-1',
        countryCode: '+52',
        number: '8121234567',
        useForReservations: true,
        visibleOnWeb: true,
        createdAt: '2025-12-01T10:00:00Z'
      }
    ]);
  }

  // ==================== ERROR HANDLING ====================

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    const errorMessage = error.error?.message || error.message || 'Error desconocido';
    return throwError(() => new Error(errorMessage));
  }
}