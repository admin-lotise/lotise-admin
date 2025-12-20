import { Injectable, signal, computed } from '@angular/core';
import { PaymentMethod } from '../../shared/models/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsStateService {
  // Signal privado para la lista de métodos
  private readonly _paymentMethods = signal<PaymentMethod[]>([]);

  // Signal público (readonly)
  readonly paymentMethods = this._paymentMethods.asReadonly();

  // Computed signals útiles
  readonly activeMethods = computed(() => 
    this._paymentMethods().filter(m => m.isActive)
  );

  readonly primaryMethod = computed(() => 
    this._paymentMethods().find(m => m.isPrimary)
  );

  readonly hasActiveMethods = computed(() => 
    this.activeMethods().length > 0
  );

  /**
   * Establecer lista completa de métodos
   */
  setPaymentMethods(methods: PaymentMethod[]): void {
    this._paymentMethods.set(methods);
  }

  /**
   * Agregar nuevo método
   */
  addPaymentMethod(method: PaymentMethod): void {
    this._paymentMethods.update(methods => [...methods, method]);
  }

  /**
   * Actualizar método de pago
   * ✅ CORREGIDO: Usar _paymentMethods en vez de paymentMethods
   */
  updatePaymentMethod(id: string, updates: Partial<PaymentMethod> | PaymentMethod): void {
    this._paymentMethods.update((methods: PaymentMethod[]) =>
      methods.map((method: PaymentMethod) =>
        method.id === id
          ? { ...method, ...updates, updatedAt: new Date() }
          : method
      )
    );
  }

  /**
   * Eliminar método
   */
  deletePaymentMethod(id: string): void {
    this._paymentMethods.update(methods => methods.filter(m => m.id !== id));
  }

  /**
   * Establecer método como principal
   */
  setPrimaryMethod(id: string): void {
    this._paymentMethods.update(methods =>
      methods.map(m => ({ ...m, isPrimary: m.id === id }))
    );
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._paymentMethods.set([]);
  }
}