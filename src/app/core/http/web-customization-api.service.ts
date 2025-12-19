import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  WebCustomization, 
  UpdateWebCustomizationDto 
} from '../../shared/models/web-customization.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebCustomizationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/web-customization`;

  /**
   * Obtener personalización web del tenant
   */
  getCustomization(tenantId: string): Observable<WebCustomization> {
    return this.http.get<WebCustomization>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Actualizar personalización web
   */
  updateCustomization(
    tenantId: string, 
    updates: UpdateWebCustomizationDto
  ): Observable<WebCustomization> {
    return this.http.put<WebCustomization>(`${this.baseUrl}/${tenantId}`, updates);
  }

  /**
   * Actualizar solo colores
   */
  updateColors(
    tenantId: string, 
    colors: {
      primaryColor?: string;
      primaryContrast?: string;
      secondaryColor?: string;
      secondaryContrast?: string;
    }
  ): Observable<WebCustomization> {
    return this.http.patch<WebCustomization>(
      `${this.baseUrl}/${tenantId}/colors`, 
      colors
    );
  }

  /**
   * Actualizar solo funcionalidades
   */
  updateFeatures(
    tenantId: string, 
    features: Partial<UpdateWebCustomizationDto>
  ): Observable<WebCustomization> {
    return this.http.patch<WebCustomization>(
      `${this.baseUrl}/${tenantId}/features`, 
      features
    );
  }

  /**
   * Subir logo
   */
  uploadLogo(tenantId: string, file: File): Observable<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('logo', file);
    return this.http.post<{ logoUrl: string }>(
      `${this.baseUrl}/${tenantId}/upload-logo`, 
      formData
    );
  }

  /**
   * Eliminar logo
   */
  deleteLogo(tenantId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/logo`);
  }

  /**
   * Subir favicon
   */
  uploadFavicon(tenantId: string, file: File): Observable<{ faviconUrl: string }> {
    const formData = new FormData();
    formData.append('favicon', file);
    return this.http.post<{ faviconUrl: string }>(
      `${this.baseUrl}/${tenantId}/upload-favicon`, 
      formData
    );
  }

  /**
   * Subir imagen de fondo
   */
  uploadBackgroundImage(
    tenantId: string, 
    file: File
  ): Observable<{ backgroundImageUrl: string }> {
    const formData = new FormData();
    formData.append('background', file);
    return this.http.post<{ backgroundImageUrl: string }>(
      `${this.baseUrl}/${tenantId}/upload-background`, 
      formData
    );
  }

  /**
   * Resetear a valores por defecto
   */
  resetToDefaults(tenantId: string): Observable<WebCustomization> {
    return this.http.post<WebCustomization>(`${this.baseUrl}/${tenantId}/reset`, {});
  }
}