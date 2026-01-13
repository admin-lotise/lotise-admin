import { Injectable, inject, signal, computed } from '@angular/core';
import { PaymentsApiService } from '../http/payments-api.service';
import { Payment, ValidatePaymentRequest, RejectPaymentRequest } from '../../shared/models/ticket.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RafflePaymentsStateService {
  private api = inject(PaymentsApiService);

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

      const payments = await firstValueFrom(
        this.api.getRafflePayments(raffleId)
      );

      this.paymentsMap.update(map => {
        const newMap = new Map(map);
        newMap.set(raffleId, payments);
        return newMap;
      });
    } catch (err: any) {
      this.error.set(err?.message || 'Error loading payments');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Validate payment
  async validatePayment(
    raffleId: string,
    request: ValidatePaymentRequest
  ): Promise<void> {
    try {
      this.isLoading.set(true);

      await firstValueFrom(this.api.validatePayment(request));
      
      // Reload payments
      await this.loadPayments(raffleId);
      
      // Notify other services (via event or direct call)
      // ticketsState.refreshAfterPayment(raffleId);
      // participantsState.refreshAfterPayment(raffleId);
    } catch (err: any) {
      this.error.set(err?.message || 'Error validating payment');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Reject payment
  async rejectPayment(
    raffleId: string,
    request: RejectPaymentRequest
  ): Promise<void> {
    try {
      this.isLoading.set(true);

      await firstValueFrom(this.api.rejectPayment(request));
      
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