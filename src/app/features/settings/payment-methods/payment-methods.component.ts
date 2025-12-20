import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, finalize } from 'rxjs';
import { PaymentMethodsStateService } from '../../../core/signals/payment-methods-state.service';
import { PaymentMethodsApiService } from '../../../core/http/payment-methods-api.service';
import { PaymentMethodCardComponent } from './payment-method-card/payment-method-card.component';
import { PaymentMethodFormComponent } from './payment-method-form/payment-method-form.component';
import { PaymentMethod, CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../../../shared/models/payment-method.model';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [
    CommonModule,
    PaymentMethodCardComponent,
    PaymentMethodFormComponent
  ],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss'
})
export class PaymentMethodsComponent implements OnInit {
  private readonly paymentMethodsState = inject(PaymentMethodsStateService);
  private readonly paymentMethodsApi = inject(PaymentMethodsApiService);

  // Signals del estado global
  paymentMethods = this.paymentMethodsState.paymentMethods;
  activeMethods = this.paymentMethodsState.activeMethods;
  primaryMethod = this.paymentMethodsState.primaryMethod;
  hasActiveMethods = this.paymentMethodsState.hasActiveMethods;

  // Signals locales
  isLoading = signal(false);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingMethod = signal<PaymentMethod | null>(null);
  isDeleting = signal<string | null>(null);

  // Computed
  hasNoMethods = computed(() => this.paymentMethods().length === 0);

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  /**
   * Cargar métodos de pago desde la API
   */
  async loadPaymentMethods(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const tenantId = 'tenant-demo'; // TODO: Obtener desde AuthStateService
      const methods = await firstValueFrom(
        this.paymentMethodsApi.getPaymentMethods(tenantId)
      );
      this.paymentMethodsState.setPaymentMethods(methods);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar métodos de pago');
      console.error('Error loading payment methods:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Abrir formulario para crear nuevo método
   */
  openCreateForm(): void {
    this.editingMethod.set(null);
    this.showForm.set(true);
  }

  /**
   * Abrir formulario para editar método existente
   */
  onEdit(method: PaymentMethod): void {
    this.editingMethod.set(method);
    this.showForm.set(true);
  }

  /**
   * Guardar método de pago (crear o actualizar)
   */
  async onSave(data: CreatePaymentMethodDto | UpdatePaymentMethodDto): Promise<void> {
    const tenantId = 'tenant-demo';
    const editingId = this.editingMethod()?.id;

    try {
      if (editingId) {
        const updateDto: UpdatePaymentMethodDto = { ...data };
        
        const updated = await firstValueFrom(
          this.paymentMethodsApi.updatePaymentMethod(tenantId, editingId, updateDto)
            .pipe(
              finalize(() => {
                console.log('Finalizado update');
              })
            )
        );
        
        this.paymentMethodsState.updatePaymentMethod(editingId, updated);
      } else {
        // ✅ CORREGIDO: Spread primero, luego valores por defecto
        const createDto: CreatePaymentMethodDto = {
          ...data,
          paymentType: data.paymentType!,
          accountHolder: data.accountHolder!,
          isActive: data.isActive ?? true,
          isPrimary: data.isPrimary ?? false
        };
        
        const created = await firstValueFrom(
          this.paymentMethodsApi.createPaymentMethod(tenantId, createDto)
            .pipe(
              finalize(() => {
                console.log('Finalizado create');
              })
            )
        );
        
        this.paymentMethodsState.addPaymentMethod(created);
      }

      this.closeForm();
    } catch (err: any) {
      console.error('Error saving:', err);
      this.error.set(err?.message || 'Error al guardar método de pago');
    }
  }

  /**
   * Cerrar formulario
   */
  closeForm(): void {
    this.showForm.set(false);
    this.editingMethod.set(null);
    // ✅ El effect del form-component reseteará isSaving automáticamente
  }

  /**
   * Eliminar método de pago
   */
  async onDelete(method: PaymentMethod): Promise<void> {
    if (!confirm(`¿Eliminar método de pago ${method.bank}?`)) {
      return;
    }

    this.isDeleting.set(method.id);
    try {
      const tenantId = 'tenant-demo'; // TODO: Obtener desde AuthStateService
      await firstValueFrom(
        this.paymentMethodsApi.deletePaymentMethod(tenantId, method.id)
      );
      this.paymentMethodsState.deletePaymentMethod(method.id);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al eliminar método de pago');
      console.error('Error deleting payment method:', err);
    } finally {
      this.isDeleting.set(null);
    }
  }

  /**
   * Establecer como método principal
   */
  async onSetPrimary(method: PaymentMethod): Promise<void> {
    try {
      const tenantId = 'tenant-demo'; // TODO: Obtener desde AuthStateService
      await firstValueFrom(
        this.paymentMethodsApi.setPrimaryMethod(tenantId, method.id)
      );
      this.paymentMethodsState.setPrimaryMethod(method.id);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al establecer método principal');
      console.error('Error setting primary method:', err);
    }
  }

  /**
   * Activar/Desactivar método
   */
  async onToggleActive(method: PaymentMethod): Promise<void> {
    try {
      const tenantId = 'tenant-demo'; // TODO: Obtener desde AuthStateService
      const newStatus = !method.isActive;
      
      await firstValueFrom(
        this.paymentMethodsApi.toggleActive(tenantId, method.id, newStatus)
      );
      
      this.paymentMethodsState.updatePaymentMethod(method.id, { isActive: newStatus });
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cambiar estado del método');
      console.error('Error toggling active status:', err);
    }
  }

  /**
   * Recargar datos
   */
  reloadData(): void {
    this.loadPaymentMethods();
  }
}