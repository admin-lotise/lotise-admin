import { Injectable, signal, computed, inject } from '@angular/core';
import { Payment } from '../../shared/models/ticket.model';
import { RaffleMockDataService } from '../services/raffle-mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RafflePaymentsStateService {
  private mockData = inject(RaffleMockDataService);

  // State
  private paymentsMap = signal<Map<string, Payment[]>>(new Map());
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Get payments for specific raffle
  getPayments(raffleId: string) {
    return computed(() => this.paymentsMap().get(raffleId) || []);
  }

  // Stats computadas
  getPaymentStats(raffleId: string) {
    return computed(() => {
      const payments = this.paymentsMap().get(raffleId) || [];
      return {
        total: payments.length,
        pending: payments.filter(p => p.status === 'Pending').length,
        confirmed: payments.filter(p => p.status === 'Confirmed').length,
        rejected: payments.filter(p => p.status === 'Rejected').length,
        totalAmount: payments
          .filter(p => p.status === 'Confirmed')
          .reduce((sum, p) => sum + p.amount, 0)
      };
    });
  }

  // Load payments
  async loadPayments(raffleId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // ==================== USAR MOCK DATA ====================
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockPayments = this.mockData.getMockPayments(raffleId);
      this.paymentsMap.update(map => {
        map.set(raffleId, mockPayments);
        return new Map(map);
      });

      // TODO: Reemplazar con llamada real al API
      // const response = await firstValueFrom(this.paymentsApi.getPayments(raffleId));
      // this.paymentsMap.update(map => {
      //   map.set(raffleId, response);
      //   return new Map(map);
      // });

    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar los pagos');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Validate payment (mock implementation)
  async validatePayment(raffleId: string, paymentId: string): Promise<void> {
    try {
      this.isLoading.set(true);

      // TODO: Implementar llamada al API real
      // await firstValueFrom(this.api.validatePayment(paymentId));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload payments
      await this.loadPayments(raffleId);
    } catch (err: any) {
      this.error.set(err?.message || 'Error validating payment');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Reject payment (mock implementation)
  async rejectPayment(raffleId: string, paymentId: string, reason: string): Promise<void> {
    try {
      this.isLoading.set(true);

      // TODO: Implementar llamada al API real
      // await firstValueFrom(this.api.rejectPayment(paymentId, reason));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload payments
      await this.loadPayments(raffleId);
    } catch (err: any) {
      this.error.set(err?.message || 'Error rejecting payment');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Clear cache
  clearCache(raffleId?: string): void {
    if (raffleId) {
      this.paymentsMap.update(map => {
        const newMap = new Map(map);
        newMap.delete(raffleId);
        return newMap;
      });
    } else {
      this.paymentsMap.set(new Map());
    }
  }
}