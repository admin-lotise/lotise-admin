import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  WhatsAppTemplate, 
  SaveWhatsAppTemplateDto,
  TemplateType 
} from '../../shared/models/whatsapp-template.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppTemplatesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/whatsapp-templates`;

  /**
   * Obtener todas las plantillas del tenant
   */
  getTemplates(tenantId: string): Observable<WhatsAppTemplate[]> {
    return this.http.get<WhatsAppTemplate[]>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Obtener plantilla por ID
   */
  getTemplateById(tenantId: string, templateId: string): Observable<WhatsAppTemplate> {
    return this.http.get<WhatsAppTemplate>(`${this.baseUrl}/${tenantId}/${templateId}`);
  }

  /**
   * Obtener plantilla por tipo
   */
  getTemplateByType(tenantId: string, type: TemplateType): Observable<WhatsAppTemplate> {
    return this.http.get<WhatsAppTemplate>(`${this.baseUrl}/${tenantId}/type/${type}`);
  }

  /**
   * Crear nueva plantilla
   */
  createTemplate(
    tenantId: string, 
    template: SaveWhatsAppTemplateDto
  ): Observable<WhatsAppTemplate> {
    return this.http.post<WhatsAppTemplate>(`${this.baseUrl}/${tenantId}`, template);
  }

  /**
   * Actualizar plantilla
   */
  updateTemplate(
    tenantId: string, 
    templateId: string, 
    updates: SaveWhatsAppTemplateDto
  ): Observable<WhatsAppTemplate> {
    return this.http.put<WhatsAppTemplate>(
      `${this.baseUrl}/${tenantId}/${templateId}`, 
      updates
    );
  }

  /**
   * Eliminar plantilla
   */
  deleteTemplate(tenantId: string, templateId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/${templateId}`);
  }

  /**
   * Activar/Desactivar plantilla
   */
  toggleActive(
    tenantId: string, 
    templateId: string, 
    isActive: boolean
  ): Observable<WhatsAppTemplate> {
    return this.http.patch<WhatsAppTemplate>(
      `${this.baseUrl}/${tenantId}/${templateId}/toggle-active`, 
      { isActive }
    );
  }

  /**
   * Resetear plantilla a contenido por defecto
   */
  resetToDefault(tenantId: string, templateId: string): Observable<WhatsAppTemplate> {
    return this.http.post<WhatsAppTemplate>(
      `${this.baseUrl}/${tenantId}/${templateId}/reset`, 
      {}
    );
  }

  /**
   * Previsualizar plantilla con variables
   */
  previewTemplate(
    templateId: string, 
    variables: Record<string, string>
  ): Observable<{ preview: string }> {
    return this.http.post<{ preview: string }>(
      `${this.baseUrl}/preview/${templateId}`, 
      { variables }
    );
  }
}