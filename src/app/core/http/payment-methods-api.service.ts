import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { 
  PaymentMethod, 
  CreatePaymentMethodDto, 
  UpdatePaymentMethodDto,
  PaymentType,
  Bank
} from '../../shared/models/payment-method.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || 'https://api.lotise.com';

  // Flag para simular API (cambiar a false cuando backend esté listo)
  private readonly USE_MOCK_DATA = true;

  // Mock data storage
  private mockMethods: PaymentMethod[] = [
    {
      id: '1',
      tenantId: 'tenant-demo',
      paymentType: PaymentType.BANK_TRANSFER,
      bank: Bank.BBVA,
      accountNumber: '0123456789',
      accountHolder: 'Juan Pérez García',
      isActive: true,
      isPrimary: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      tenantId: 'tenant-demo',
      paymentType: PaymentType.CLABE,
      bank: Bank.BANORTE,
      clabe: '072580001234567890',
      accountHolder: 'Juan Pérez García',
      isActive: true,
      isPrimary: false,
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date()
    },
    {
      id: '3',
      tenantId: 'tenant-demo',
      paymentType: PaymentType.DEBIT_CARD,
      bank: Bank.SANTANDER,
      cardNumber: '5678',
      accountHolder: 'Juan Pérez García',
      isActive: false,
      isPrimary: false,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date()
    }
  ];

  /**
   * Obtener todos los métodos de pago del tenant
   */
  getPaymentMethods(tenantId: string): Observable<PaymentMethod[]> {
    if (this.USE_MOCK_DATA) {
      return of(this.mockMethods.filter(m => m.tenantId === tenantId)).pipe(delay(500));
    }

    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/tenants/${tenantId}/payment-methods`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener método de pago por ID
   */
  getPaymentMethodById(tenantId: string, methodId: string): Observable<PaymentMethod> {
    if (this.USE_MOCK_DATA) {
      const method = this.mockMethods.find(m => m.id === methodId && m.tenantId === tenantId);
      return method ? of(method).pipe(delay(300)) : throwError(() => new Error('Método no encontrado'));
    }

    return this.http.get<PaymentMethod>(`${this.apiUrl}/tenants/${tenantId}/payment-methods/${methodId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear nuevo método de pago
   */
  createPaymentMethod(tenantId: string, dto: CreatePaymentMethodDto): Observable<PaymentMethod> {
    if (this.USE_MOCK_DATA) {
      const newMethod: PaymentMethod = {
        id: `${Date.now()}`,
        tenantId,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Si es principal, quitar el flag de otros métodos
      if (dto.isPrimary) {
        this.mockMethods = this.mockMethods.map(m => ({ ...m, isPrimary: false }));
      }

      this.mockMethods.push(newMethod);
      return of(newMethod).pipe(delay(800));
    }

    return this.http.post<PaymentMethod>(`${this.apiUrl}/tenants/${tenantId}/payment-methods`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar método de pago
   */
  updatePaymentMethod(tenantId: string, methodId: string, dto: CreatePaymentMethodDto): Observable<PaymentMethod> {
    if (this.USE_MOCK_DATA) {
      const index = this.mockMethods.findIndex(m => m.id === methodId && m.tenantId === tenantId);
      
      if (index === -1) {
        return throwError(() => new Error('Método no encontrado'));
      }

      // Si es principal, quitar el flag de otros métodos
      if (dto.isPrimary) {
        this.mockMethods = this.mockMethods.map(m => ({ ...m, isPrimary: false }));
      }

      this.mockMethods[index] = {
        ...this.mockMethods[index],
        ...dto,
        updatedAt: new Date()
      };

      return of(this.mockMethods[index]).pipe(delay(800));
    }

    return this.http.put<PaymentMethod>(`${this.apiUrl}/tenants/${tenantId}/payment-methods/${methodId}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar método de pago
   */
  deletePaymentMethod(tenantId: string, methodId: string): Observable<void> {
    if (this.USE_MOCK_DATA) {
      this.mockMethods = this.mockMethods.filter(m => !(m.id === methodId && m.tenantId === tenantId));
      return of(void 0).pipe(delay(600));
    }

    return this.http.delete<void>(`${this.apiUrl}/tenants/${tenantId}/payment-methods/${methodId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Establecer método como principal
   */
  setPrimaryMethod(tenantId: string, methodId: string): Observable<PaymentMethod> {
    if (this.USE_MOCK_DATA) {
      // Quitar flag de todos
      this.mockMethods = this.mockMethods.map(m => ({ ...m, isPrimary: false }));
      
      // Establecer el nuevo principal
      const index = this.mockMethods.findIndex(m => m.id === methodId && m.tenantId === tenantId);
      if (index === -1) {
        return throwError(() => new Error('Método no encontrado'));
      }

      this.mockMethods[index] = {
        ...this.mockMethods[index],
        isPrimary: true,
        updatedAt: new Date()
      };

      return of(this.mockMethods[index]).pipe(delay(500));
    }

    return this.http.patch<PaymentMethod>(
      `${this.apiUrl}/tenants/${tenantId}/payment-methods/${methodId}/set-primary`, 
      {}
    ).pipe(catchError(this.handleError));
  }

  /**
   * Activar/Desactivar método
   */
  toggleActive(tenantId: string, methodId: string, isActive: boolean): Observable<PaymentMethod> {
    if (this.USE_MOCK_DATA) {
      const index = this.mockMethods.findIndex(m => m.id === methodId && m.tenantId === tenantId);
      
      if (index === -1) {
        return throwError(() => new Error('Método no encontrado'));
      }

      this.mockMethods[index] = {
        ...this.mockMethods[index],
        isActive,
        updatedAt: new Date()
      };

      return of(this.mockMethods[index]).pipe(delay(500));
    }

    return this.http.patch<PaymentMethod>(
      `${this.apiUrl}/tenants/${tenantId}/payment-methods/${methodId}/toggle-active`, 
      { isActive }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Manejo de errores
   */
  private handleError(error: any): Observable<never> {
    console.error('Payment Methods API Error:', error);
    const errorMessage = error.error?.message || error.message || 'Error desconocido';
    return throwError(() => new Error(errorMessage));
  }
}