import { Component, inject, input, output, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  PaymentMethod, 
  PaymentType, 
  Bank,
  BANKS_CATALOG,
  BankInfo,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto
} from '../../../../shared/models/payment-method.model';

@Component({
  selector: 'app-payment-method-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-method-form.component.html',
  styleUrl: './payment-method-form.component.scss'
})
export class PaymentMethodFormComponent {
  private fb = inject(FormBuilder);

  // Inputs/Outputs
  paymentMethod = input<PaymentMethod | null>(null);
  save = output<CreatePaymentMethodDto | UpdatePaymentMethodDto>();
  cancel = output<void>();

  // State
  form!: FormGroup;
  error = signal<string | null>(null);
  isSaving = signal(false);
  bankSearchTerm = signal('');

  // Data
  paymentTypes = Object.values(PaymentType);

  constructor() {
    this.initForm();
    
    effect(() => {
      const method = this.paymentMethod();
      if (method) {
        this.patchForm(method);
      }
    });

    effect(() => {
      const paymentType = this.form?.get('paymentType')?.value;
      this.updateValidators(paymentType);
    }, { allowSignalWrites: true });
  }

  private initForm(): void {
    this.form = this.fb.group({
      paymentType: [null, Validators.required],
      bank: [null],
      accountNumber: [''],
      clabe: [''],
      cardNumber: [''],
      accountHolder: ['', Validators.required],
      isActive: [true],
      isPrimary: [false]
    });
  }

  private patchForm(method: PaymentMethod): void {
    this.form.patchValue({
      paymentType: method.paymentType,
      bank: method.bank,
      accountNumber: method.accountNumber || '',
      clabe: method.clabe || '',
      cardNumber: method.cardNumber || '',
      accountHolder: method.accountHolder || '',
      isActive: method.isActive,
      isPrimary: method.isPrimary
    });
  }

  private updateValidators(paymentType: PaymentType): void {
    const bankControl = this.form.get('bank');
    const accountNumberControl = this.form.get('accountNumber');
    const clabeControl = this.form.get('clabe');
    const cardNumberControl = this.form.get('cardNumber');

    bankControl?.clearValidators();
    accountNumberControl?.clearValidators();
    clabeControl?.clearValidators();
    cardNumberControl?.clearValidators();

    switch (paymentType) {
      case PaymentType.BANK_TRANSFER:
      case PaymentType.CLABE:
        bankControl?.setValidators([Validators.required]);
        if (paymentType === PaymentType.CLABE) {
          clabeControl?.setValidators([
            Validators.required,
            Validators.pattern(/^\d{18}$/),
            Validators.minLength(18),
            Validators.maxLength(18)
          ]);
        } else {
          accountNumberControl?.setValidators([
            Validators.required,
            Validators.pattern(/^\d{10,18}$/),
            Validators.minLength(10),
            Validators.maxLength(18)
          ]);
        }
        break;

      case PaymentType.DEBIT_CARD:
      case PaymentType.CREDIT_CARD:
        bankControl?.setValidators([Validators.required]);
        cardNumberControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{16}$/),
          Validators.minLength(16),
          Validators.maxLength(16)
        ]);
        break;
    }

    bankControl?.updateValueAndValidity();
    accountNumberControl?.updateValueAndValidity();
    clabeControl?.updateValueAndValidity();
    cardNumberControl?.updateValueAndValidity();
  }

  getBanksByCategory() {
    const searchTerm = this.bankSearchTerm().toLowerCase().trim();
    
    const categories: Record<string, { name: string; label: string; banks: BankInfo[] }> = {
      principal: { name: 'principal', label: 'Bancos Principales', banks: [] },
      digital: { name: 'digital', label: 'Bancos Digitales', banks: [] },
      regional: { name: 'regional', label: 'Bancos Regionales', banks: [] },
      gubernamental: { name: 'gubernamental', label: 'Bancos Gubernamentales', banks: [] },
      otro: { name: 'otro', label: 'Otros Bancos', banks: [] }
    };

    BANKS_CATALOG.forEach((bank: BankInfo) => {
      if (!searchTerm || bank.name.toLowerCase().includes(searchTerm)) {
        categories[bank.category].banks.push(bank);
      }
    });

    return Object.values(categories).filter(cat => cat.banks.length > 0);
  }

  // ✅ NUEVO - Contar bancos encontrados
  getFilteredBanksCount(): number {
    return this.getBanksByCategory().reduce((acc, cat) => acc + cat.banks.length, 0);
  }

  onBankSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.bankSearchTerm.set(input.value);
  }

  clearBankSearch(): void {
    this.bankSearchTerm.set('');
  }

  getCategoryIcon(categoryName: string): string {
    const icons: Record<string, string> = {
      principal: 'fas fa-star',
      digital: 'fas fa-mobile-alt',
      regional: 'fas fa-map-marker-alt',
      gubernamental: 'fas fa-landmark',
      otro: 'fas fa-ellipsis-h'
    };
    return icons[categoryName] || 'fas fa-university';
  }

  showBankSelect(): boolean {
    const type = this.form.get('paymentType')?.value;
    return [
      PaymentType.BANK_TRANSFER,
      PaymentType.CLABE,
      PaymentType.DEBIT_CARD,
      PaymentType.CREDIT_CARD
    ].includes(type);
  }

  showAccountNumber(): boolean {
    return this.form.get('paymentType')?.value === PaymentType.BANK_TRANSFER;
  }

  showClabe(): boolean {
    return this.form.get('paymentType')?.value === PaymentType.CLABE;
  }

  showCardNumber(): boolean {
    const type = this.form.get('paymentType')?.value;
    return type === PaymentType.DEBIT_CARD || type === PaymentType.CREDIT_CARD;
  }

  getPaymentTypeIcon(type: PaymentType): string {
    const icons: Record<PaymentType, string> = {
      [PaymentType.BANK_TRANSFER]: 'fas fa-exchange-alt',
      [PaymentType.CLABE]: 'fas fa-barcode',
      [PaymentType.DEBIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CREDIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CASH]: 'fas fa-money-bill-wave',
      [PaymentType.PAYPAL]: 'fab fa-paypal',
      [PaymentType.MERCADO_PAGO]: 'fas fa-shopping-cart'
    };
    return icons[type] || 'fas fa-money-check-alt';
  }

  getPaymentTypeName(type: PaymentType): string {
    const names: Record<PaymentType, string> = {
      [PaymentType.BANK_TRANSFER]: 'Transferencia Bancaria',
      [PaymentType.CLABE]: 'CLABE Interbancaria',
      [PaymentType.DEBIT_CARD]: 'Tarjeta de Débito',
      [PaymentType.CREDIT_CARD]: 'Tarjeta de Crédito',
      [PaymentType.CASH]: 'Efectivo / OXXO',
      [PaymentType.PAYPAL]: 'PayPal',
      [PaymentType.MERCADO_PAGO]: 'Mercado Pago'
    };
    return names[type] || type;
  }

  onClabeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 18);
    this.form.get('clabe')?.setValue(input.value, { emitEvent: false });
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 16);
    this.form.get('cardNumber')?.setValue(input.value, { emitEvent: false });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['pattern']) {
      if (fieldName === 'clabe') return 'La CLABE debe tener exactamente 18 dígitos';
      if (fieldName === 'cardNumber') return 'El número de tarjeta debe tener 16 dígitos';
      if (fieldName === 'accountNumber') return 'El número de cuenta debe tener entre 10 y 18 dígitos';
    }
    if (field.errors['minlength'] || field.errors['maxlength']) {
      if (fieldName === 'clabe') return 'La CLABE debe tener exactamente 18 dígitos';
      if (fieldName === 'cardNumber') return 'El número de tarjeta debe tener 16 dígitos';
    }

    return 'Campo inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      this.error.set('Por favor completa todos los campos requeridos');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const formValue = this.form.value;
    const dto: CreatePaymentMethodDto | UpdatePaymentMethodDto = {
      paymentType: formValue.paymentType,
      bank: formValue.bank || undefined,
      accountNumber: formValue.accountNumber || undefined,
      clabe: formValue.clabe || undefined,
      cardNumber: formValue.cardNumber || undefined,
      accountHolder: formValue.accountHolder,
      isActive: formValue.isActive,
      isPrimary: formValue.isPrimary
    };

    this.save.emit(dto);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}