import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive'; // ✅ IMPORTAR
import { PaymentMethod, PaymentType, BankAccountType } from '../../../../shared/models/payment-method.model';

@Component({
  selector: 'app-payment-method-card',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective], // ✅ AGREGAR AQUÍ
  templateUrl: './payment-method-card.component.html',
  styleUrl: './payment-method-card.component.scss'
})
export class PaymentMethodCardComponent {
  // Inputs
  method = input.required<PaymentMethod>();

  // Outputs
  edit = output<PaymentMethod>();
  delete = output<PaymentMethod>();
  setPrimary = output<PaymentMethod>();
  toggleActive = output<PaymentMethod>();

  // State
  showActions = signal(false);
  isDeleting = signal(false);

  // Computed
  bankLogo = computed(() => {
    const bank = this.method().bank;
    if (!bank) return 'fas fa-university';
    
    const logos: Record<string, string> = {
      'BBVA': 'fab fa-cc-visa',
      'SANTANDER': 'fas fa-building-columns',
      'BANORTE': 'fas fa-landmark',
      'HSBC': 'fas fa-university',
      'SCOTIABANK': 'fas fa-piggy-bank',
      'BANAMEX': 'fas fa-money-check-alt'
    };
    
    return logos[bank] || 'fas fa-university';
  });

  paymentTypeColor = computed(() => {
    const colors: Record<PaymentType, string> = {
      [PaymentType.BANK_TRANSFER]: '#3b82f6',
      [PaymentType.CLABE]: '#8b5cf6',
      [PaymentType.DEBIT_CARD]: '#10b981',
      [PaymentType.CREDIT_CARD]: '#f59e0b',
      [PaymentType.CASH]: '#6b7280',
      [PaymentType.PAYPAL]: '#0070ba',
      [PaymentType.MERCADO_PAGO]: '#00b1ea'
    };
    return colors[this.method().paymentType] || '#6b7280';
  });

  paymentTypeIcon = computed(() => {
    const icons: Record<PaymentType, string> = {
      [PaymentType.BANK_TRANSFER]: 'fas fa-exchange-alt',
      [PaymentType.CLABE]: 'fas fa-barcode',
      [PaymentType.DEBIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CREDIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CASH]: 'fas fa-money-bill-wave',
      [PaymentType.PAYPAL]: 'fab fa-paypal',
      [PaymentType.MERCADO_PAGO]: 'fas fa-shopping-cart'
    };
    return icons[this.method().paymentType] || 'fas fa-money-check-alt';
  });

  paymentTypeText = computed(() => {
    const method = this.method();
    
    // Si es transferencia bancaria, mostrar el tipo de cuenta
    if (method.paymentType === PaymentType.BANK_TRANSFER && method.bankAccountType) {
      const types: Record<BankAccountType, string> = {
        [BankAccountType.ACCOUNT_NUMBER]: 'Transferencia - Cuenta',
        [BankAccountType.CLABE]: 'Transferencia - CLABE',
        [BankAccountType.CARD]: 'Transferencia - Tarjeta'
      };
      return types[method.bankAccountType] || 'Transferencia Bancaria';
    }

    const names: Record<PaymentType, string> = {
      [PaymentType.BANK_TRANSFER]: 'Transferencia Bancaria',
      [PaymentType.CLABE]: 'CLABE Interbancaria',
      [PaymentType.DEBIT_CARD]: 'Tarjeta de Débito',
      [PaymentType.CREDIT_CARD]: 'Tarjeta de Crédito',
      [PaymentType.CASH]: 'Efectivo / OXXO',
      [PaymentType.PAYPAL]: 'PayPal',
      [PaymentType.MERCADO_PAGO]: 'Mercado Pago'
    };
    return names[method.paymentType] || method.paymentType;
  });

  maskedAccount = computed(() => {
    const method = this.method();
    
    if (method.accountNumber) {
      return method.accountNumber.length > 4 
        ? `****${method.accountNumber.slice(-4)}` 
        : method.accountNumber;
    }
    
    if (method.clabe) {
      return method.clabe.length === 18
        ? `${method.clabe.slice(0, 3)} ${method.clabe.slice(3, 6)} ****${method.clabe.slice(-4)}`
        : method.clabe;
    }
    
    if (method.cardNumber) {
      return `**** **** **** ${method.cardNumber}`;
    }

    return 'N/A';
  });

  accountLabel = computed(() => {
    const method = this.method();
    
    if (method.accountNumber) return 'Cuenta';
    if (method.clabe) return 'CLABE';
    if (method.cardNumber) return 'Tarjeta';
    return 'Número';
  });

  toggleActions(): void {
    this.showActions.update(v => !v);
  }

  closeActions(): void {
    this.showActions.set(false);
  }

  onEdit(): void {
    this.closeActions();
    this.edit.emit(this.method());
  }

  onDelete(): void {
    this.closeActions();
    this.isDeleting.set(true);
    this.delete.emit(this.method());
  }

  onSetPrimary(): void {
    this.closeActions();
    this.setPrimary.emit(this.method());
  }

  onToggleActive(): void {
    this.closeActions();
    this.toggleActive.emit(this.method());
  }

  getBankName(bank?: string): string {
    if (!bank) return 'Banco';
    return bank.replace(/_/g, ' ');
  }
}