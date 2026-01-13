import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RafflePaymentsStateService } from '../../../../../core/signals/raffle-payments-state.service';
import { RaffleTicketsStateService } from '../../../../../core/signals/raffle-tickets-state.service';
import { RaffleParticipantsStateService } from '../../../../../core/signals/raffle-participants-state.service';
import { Payment } from '../../../../../shared/models/ticket.model';

@Component({
  selector: 'app-payments-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-tab.component.html',
  styleUrl: './payments-tab.component.scss'
})
export class PaymentsTabComponent implements OnInit {
  @Input({ required: true }) raffleId!: string;

  // Services
  private paymentsState = inject(RafflePaymentsStateService);
  private ticketsState = inject(RaffleTicketsStateService);
  private participantsState = inject(RaffleParticipantsStateService);

  // State
  payments = computed(() => this.paymentsState.getPayments(this.raffleId)());
  stats = computed(() => this.paymentsState.getPaymentStats(this.raffleId)());
  isLoading = this.paymentsState.isLoading;
  error = this.paymentsState.error;

  // Filters
  selectedStatus = signal<string>('all');
  searchTerm = signal<string>('');

  // Selected payment for modal
  selectedPayment = signal<Payment | null>(null);
  showValidationModal = signal(false);
  validationNotes = signal('');
  rejectionReason = signal('');

  // Filtered payments
  filteredPayments = computed(() => {
    let filtered = this.payments();

    // Filter by status
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(p => p.status === this.selectedStatus());
    }

    // Filter by search term
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p => 
        p.buyerFirstName.toLowerCase().includes(search) ||
        p.buyerLastName.toLowerCase().includes(search) ||
        p.buyerPhone.includes(search) ||
        p.paymentId.toLowerCase().includes(search)
      );
    }

    // Sort by createdAt DESC
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  async ngOnInit(): Promise<void> {
    await this.loadPayments();
  }

  async loadPayments(): Promise<void> {
    try {
      await this.paymentsState.loadPayments(this.raffleId);
    } catch (err) {
      console.error('Error loading payments:', err);
    }
  }

  // Actions
  openValidationModal(payment: Payment): void {
    this.selectedPayment.set(payment);
    this.showValidationModal.set(true);
    this.validationNotes.set('');
    this.rejectionReason.set('');
  }

  closeValidationModal(): void {
    this.showValidationModal.set(false);
    this.selectedPayment.set(null);
    this.validationNotes.set('');
    this.rejectionReason.set('');
  }

  async validatePayment(): Promise<void> {
    const payment = this.selectedPayment();
    if (!payment) return;

    try {
      await this.paymentsState.validatePayment(this.raffleId, {
        paymentId: payment.paymentId,
        validatedBy: 'admin-user-id', // TODO: Get from auth
        notes: this.validationNotes()
      });

      // Refresh related data
      await Promise.all([
        this.ticketsState.refreshAfterPayment(this.raffleId),
        this.participantsState.refreshAfterPayment(this.raffleId)
      ]);

      this.closeValidationModal();
      alert('Pago validado exitosamente');
    } catch (err) {
      console.error('Error validating payment:', err);
      alert('Error al validar el pago');
    }
  }

  async rejectPayment(): Promise<void> {
    const payment = this.selectedPayment();
    if (!payment || !this.rejectionReason()) {
      alert('Debes proporcionar una razón para rechazar el pago');
      return;
    }

    try {
      await this.paymentsState.rejectPayment(this.raffleId, {
        paymentId: payment.paymentId,
        rejectedBy: 'admin-user-id', // TODO: Get from auth
        reason: this.rejectionReason()
      });

      this.closeValidationModal();
      alert('Pago rechazado');
    } catch (err) {
      console.error('Error rejecting payment:', err);
      alert('Error al rechazar el pago');
    }
  }

  // Helpers
  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'Pending': 'status-pending',
      'Confirmed': 'status-confirmed',
      'Rejected': 'status-rejected'
    };
    return statusMap[status] || '';
  }

  getStatusLabel(status: string): string {
    const labelMap: Record<string, string> = {
      'Pending': 'Pendiente',
      'Confirmed': 'Confirmado',
      'Rejected': 'Rechazado'
    };
    return labelMap[status] || status;
  }

  getMethodLabel(method: string): string {
    const methodMap: Record<string, string> = {
      'transfer': 'Transferencia',
      'cash': 'Efectivo',
      'card': 'Tarjeta',
      'paypal': 'PayPal',
      'other': 'Otro'
    };
    return methodMap[method] || method;
  }

  viewProof(payment: Payment): void {
    const proofUrl = payment.metadata?.proofUrl;
    if (proofUrl) {
      window.open(proofUrl, '_blank');
    } else {
      alert('No hay comprobante disponible');
    }
  }

  exportPayments(): void {
    console.log('Exportar pagos');
    // TODO: Implement export functionality
  }
}