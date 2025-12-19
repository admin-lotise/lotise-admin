import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalContent, UpdateLegalContentDto } from '../../shared/models/legal-content.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LegalContentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/legal-content`;

  /**
   * Obtener contenido legal del tenant
   */
  getLegalContent(tenantId: string): Observable<LegalContent> {
    return this.http.get<LegalContent>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Actualizar contenido legal completo
   */
  updateLegalContent(
    tenantId: string, 
    updates: UpdateLegalContentDto
  ): Observable<LegalContent> {
    return this.http.put<LegalContent>(`${this.baseUrl}/${tenantId}`, updates);
  }

  /**
   * Actualizar solo aviso de privacidad
   */
  updatePrivacyPolicy(tenantId: string, html: string): Observable<LegalContent> {
    return this.http.patch<LegalContent>(
      `${this.baseUrl}/${tenantId}/privacy-policy`, 
      { privacyPolicyHtml: html }
    );
  }

  /**
   * Actualizar solo términos y condiciones
   */
  updateTermsConditions(tenantId: string, html: string): Observable<LegalContent> {
    return this.http.patch<LegalContent>(
      `${this.baseUrl}/${tenantId}/terms-conditions`, 
      { termsConditionsHtml: html }
    );
  }

  /**
   * Obtener solo aviso de privacidad
   */
  getPrivacyPolicy(tenantId: string): Observable<{ html: string; lastUpdate: Date }> {
    return this.http.get<{ html: string; lastUpdate: Date }>(
      `${this.baseUrl}/${tenantId}/privacy-policy`
    );
  }

  /**
   * Obtener solo términos y condiciones
   */
  getTermsConditions(tenantId: string): Observable<{ html: string; lastUpdate: Date }> {
    return this.http.get<{ html: string; lastUpdate: Date }>(
      `${this.baseUrl}/${tenantId}/terms-conditions`
    );
  }
}