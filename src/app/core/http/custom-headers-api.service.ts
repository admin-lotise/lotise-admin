import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  CustomHeader, 
  CreateCustomHeaderDto, 
  UpdateCustomHeaderDto 
} from '../../shared/models/custom-header.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomHeadersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/custom-headers`;

  /**
   * Obtener todos los headers del tenant
   */
  getHeaders(tenantId: string): Observable<CustomHeader[]> {
    return this.http.get<CustomHeader[]>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Obtener header por ID
   */
  getHeaderById(tenantId: string, headerId: string): Observable<CustomHeader> {
    return this.http.get<CustomHeader>(`${this.baseUrl}/${tenantId}/${headerId}`);
  }

  /**
   * Crear nuevo header
   */
  createHeader(tenantId: string, header: CreateCustomHeaderDto): Observable<CustomHeader> {
    return this.http.post<CustomHeader>(`${this.baseUrl}/${tenantId}`, header);
  }

  /**
   * Actualizar header
   */
  updateHeader(
    tenantId: string, 
    headerId: string, 
    updates: UpdateCustomHeaderDto
  ): Observable<CustomHeader> {
    return this.http.put<CustomHeader>(`${this.baseUrl}/${tenantId}/${headerId}`, updates);
  }

  /**
   * Eliminar header
   */
  deleteHeader(tenantId: string, headerId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/${headerId}`);
  }

  /**
   * Subir imagen del header
   */
  uploadHeaderImage(
    tenantId: string, 
    headerId: string, 
    file: File
  ): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(
      `${this.baseUrl}/${tenantId}/${headerId}/upload-image`, 
      formData
    );
  }

  /**
   * Activar/Desactivar header
   */
  toggleActive(
    tenantId: string, 
    headerId: string, 
    isActive: boolean
  ): Observable<CustomHeader> {
    return this.http.patch<CustomHeader>(
      `${this.baseUrl}/${tenantId}/${headerId}/toggle-active`, 
      { isActive }
    );
  }

  /**
   * Reordenar headers
   */
  reorderHeaders(tenantId: string, orderedIds: string[]): Observable<CustomHeader[]> {
    return this.http.patch<CustomHeader[]>(
      `${this.baseUrl}/${tenantId}/reorder`, 
      { orderedIds }
    );
  }

  /**
   * Obtener solo headers activos (para web pública)
   */
  getActiveHeaders(tenantId: string): Observable<CustomHeader[]> {
    return this.http.get<CustomHeader[]>(`${this.baseUrl}/${tenantId}/active`);
  }
}