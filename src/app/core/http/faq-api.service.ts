import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FAQ, CreateFAQDto, UpdateFAQDto } from '../../shared/models/faq.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FAQApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/faq`;

  /**
   * Obtener todas las FAQs del tenant
   */
  getFaqs(tenantId: string): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Obtener FAQ por ID
   */
  getFaqById(tenantId: string, faqId: string): Observable<FAQ> {
    return this.http.get<FAQ>(`${this.baseUrl}/${tenantId}/${faqId}`);
  }

  /**
   * Crear nueva FAQ
   */
  createFaq(tenantId: string, faq: CreateFAQDto): Observable<FAQ> {
    return this.http.post<FAQ>(`${this.baseUrl}/${tenantId}`, faq);
  }

  /**
   * Actualizar FAQ
   */
  updateFaq(tenantId: string, faqId: string, updates: UpdateFAQDto): Observable<FAQ> {
    return this.http.put<FAQ>(`${this.baseUrl}/${tenantId}/${faqId}`, updates);
  }

  /**
   * Eliminar FAQ
   */
  deleteFaq(tenantId: string, faqId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/${faqId}`);
  }

  /**
   * Activar/Desactivar FAQ
   */
  toggleActive(tenantId: string, faqId: string, isActive: boolean): Observable<FAQ> {
    return this.http.patch<FAQ>(
      `${this.baseUrl}/${tenantId}/${faqId}/toggle-active`, 
      { isActive }
    );
  }

  /**
   * Reordenar FAQs
   */
  reorderFaqs(tenantId: string, orderedIds: string[]): Observable<FAQ[]> {
    return this.http.patch<FAQ[]>(
      `${this.baseUrl}/${tenantId}/reorder`, 
      { orderedIds }
    );
  }

  /**
   * Obtener solo FAQs activas (para web pública)
   */
  getActiveFaqs(tenantId: string): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${this.baseUrl}/${tenantId}/active`);
  }
}