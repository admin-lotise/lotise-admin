import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  PaymentMethod, 
  CreatePaymentMethodDto, 
  UpdatePaymentMethodDto 
} from '../../shared/models/payment-method.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/payment-methods`;

  /**
   * Obtener todos los métodos de pago del tenant
   */
  getPaymentMethods(tenantId: string): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Obtener método de pago por ID
   */
  getPaymentMethodById(tenantId: string, methodId: string): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.baseUrl}/${tenantId}/${methodId}`);
  }

  /**
   * Crear nuevo método de pago
   */
  createPaymentMethod(
    tenantId: string, 
    method: CreatePaymentMethodDto
  ): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.baseUrl}/${tenantId}`, method);
  }

  /**
   * Actualizar método de pago
   */
  updatePaymentMethod(
    tenantId: string, 
    methodId: string, 
    updates: UpdatePaymentMethodDto
  ): Observable<PaymentMethod> {
    return this.http.put<PaymentMethod>(`${this.baseUrl}/${tenantId}/${methodId}`, updates);
  }

  /**
   * Eliminar método de pago
   */
  deletePaymentMethod(tenantId: string, methodId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/${methodId}`);
  }

  /**
   * Establecer método como principal
   */
  setPrimaryMethod(tenantId: string, methodId: string): Observable<PaymentMethod> {
    return this.http.patch<PaymentMethod>(
      `${this.baseUrl}/${tenantId}/${methodId}/set-primary`, 
      {}
    );
  }

  /**
   * Activar/Desactivar método
   */
  toggleActive(tenantId: string, methodId: string, isActive: boolean): Observable<PaymentMethod> {
    return this.http.patch<PaymentMethod>(
      `${this.baseUrl}/${tenantId}/${methodId}/toggle-active`, 
      { isActive }
    );
  }
}