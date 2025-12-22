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
   * ✅ CORREGIDO: Crear nueva referencia sin propiedades extra
   */
  updatePaymentMethod(id: string, updates: Partial<PaymentMethod> | PaymentMethod): void {
    this._paymentMethods.update((methods: PaymentMethod[]) =>
      methods.map((method: PaymentMethod) => {
        if (method.id !== id) {
          return method;
        }

        // ✅ Crear nuevo objeto con spread para forzar nueva referencia
        const updated: PaymentMethod = {
          ...method,
          ...updates,
          updatedAt: new Date()
        };

        return updated;
      })
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