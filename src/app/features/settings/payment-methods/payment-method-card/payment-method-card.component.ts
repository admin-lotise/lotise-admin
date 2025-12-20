import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { PaymentMethod, PaymentType, Bank, BANK_LOGOS } from '../../../../shared/models/payment-method.model';

@Component({
  selector: 'app-payment-method-card',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './payment-method-card.component.html',
  styleUrl: './payment-method-card.component.scss'
})
export class PaymentMethodCardComponent {
  @Input({ required: true }) paymentMethod!: PaymentMethod;
  @Input() isPrimary = false;
  @Input() isDeleting = false;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() setPrimary = new EventEmitter<void>();
  @Output() toggleActive = new EventEmitter<void>();

  // Menú de acciones visible
  showActions = signal(false);

  // Computed para obtener el logo del banco
  bankLogo = computed(() => {
    const bank = this.paymentMethod.bank;
    return bank ? BANK_LOGOS[bank] : 'fas fa-university';
  });

  // Computed para el ícono del tipo de pago
  paymentTypeIcon = computed(() => {
    const icons = {
      [PaymentType.BANK_TRANSFER]: 'fas fa-exchange-alt',
      [PaymentType.CLABE]: 'fas fa-barcode',
      [PaymentType.DEBIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CREDIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CASH]: 'fas fa-money-bill-wave',
      [PaymentType.PAYPAL]: 'fab fa-paypal',
      [PaymentType.MERCADO_PAGO]: 'fas fa-shopping-cart'
    };
    return icons[this.paymentMethod.paymentType] || 'fas fa-dollar-sign';
  });

  // Computed para el color del tipo de pago
  paymentTypeColor = computed(() => {
    const colors = {
      [PaymentType.BANK_TRANSFER]: '#3b82f6',
      [PaymentType.CLABE]: '#8b5cf6',
      [PaymentType.DEBIT_CARD]: '#10b981',
      [PaymentType.CREDIT_CARD]: '#f59e0b',
      [PaymentType.CASH]: '#22c55e',
      [PaymentType.PAYPAL]: '#0070ba',
      [PaymentType.MERCADO_PAGO]: '#00b1ea'
    };
    return colors[this.paymentMethod.paymentType] || '#6b7280';
  });

  // Computed para texto del tipo de pago
  paymentTypeText = computed(() => {
    const texts = {
      [PaymentType.BANK_TRANSFER]: 'Transferencia',
      [PaymentType.CLABE]: 'CLABE',
      [PaymentType.DEBIT_CARD]: 'Débito',
      [PaymentType.CREDIT_CARD]: 'Crédito',
      [PaymentType.CASH]: 'Efectivo',
      [PaymentType.PAYPAL]: 'PayPal',
      [PaymentType.MERCADO_PAGO]: 'Mercado Pago'
    };
    return texts[this.paymentMethod.paymentType] || 'Otro';
  });

  // Computed para mostrar los últimos 4 dígitos
  maskedAccount = computed(() => {
    const account = this.paymentMethod.accountNumber || this.paymentMethod.clabe || this.paymentMethod.cardNumber || '';
    if (account.length <= 4) return account;
    return `•••• ${account.slice(-4)}`;
  });

  // Toggle menú de acciones
  toggleActions(): void {
    this.showActions.update(v => !v);
  }

  // Cerrar menú de acciones
  closeActions(): void {
    this.showActions.set(false);
  }

  // Emitir acciones
  onEdit(): void {
    this.edit.emit();
    this.closeActions();
  }

  onDelete(): void {
    this.delete.emit();
    this.closeActions();
  }

  onSetPrimary(): void {
    this.setPrimary.emit();
    this.closeActions();
  }

  onToggleActive(): void {
    this.toggleActive.emit();
    this.closeActions();
  }
}