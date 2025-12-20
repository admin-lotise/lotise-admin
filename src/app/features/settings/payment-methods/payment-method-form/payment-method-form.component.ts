import { Component, inject, input, output, effect, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  PaymentMethod, 
  PaymentType, 
  Bank,
  BankAccountType,
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
  isEditing = signal(false);

  // Data
  paymentTypes = Object.values(PaymentType);
  bankAccountTypes = Object.values(BankAccountType);

  // ✅ NUEVO: Computed para habilitar botón
  canSubmit = computed(() => {
    if (!this.form) return false;
    
    const isValid = this.form.valid;
    const notSaving = !this.isSaving();
    
    // Si estamos editando, permitir guardar si es válido
    // (no requerir dirty porque puede haber cambios desde fuera del form)
    if (this.isEditing()) {
      return isValid && notSaving;
    }
    
    // Si estamos creando, solo validar
    return isValid && notSaving;
  });

  constructor() {
    this.initForm();
    
    // Effect para cargar datos al editar
    effect(() => {
      const method = this.paymentMethod();
      if (method) {
        this.isEditing.set(true);
        this.isSaving.set(false); // ✅ RESETEAR al cargar nuevo método
        this.patchForm(method);
      } else {
        this.isEditing.set(false);
        this.isSaving.set(false); // ✅ RESETEAR al crear nuevo
        this.form.reset({
          paymentType: null,
          bank: null,
          bankAccountType: null,
          accountNumber: '',
          clabe: '',
          cardNumber: '',
          accountHolder: '',
          isActive: true,
          isPrimary: false
        });
      }
    });

    // Usar valueChanges en vez de effect
    this.form.get('paymentType')?.valueChanges.subscribe(paymentType => {
      if (paymentType) {
        this.updateValidators(paymentType);
      }
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      paymentType: [null, Validators.required],
      bank: [null],
      bankAccountType: [null],
      accountNumber: [''],
      clabe: [''],
      cardNumber: [''],
      accountHolder: ['', Validators.required],
      isActive: [true],
      isPrimary: [false]
    });
  }

  private patchForm(method: PaymentMethod): void {
    // Inferir bankAccountType si no existe
    let inferredBankAccountType = method.bankAccountType;
    
    if (!inferredBankAccountType && method.paymentType === PaymentType.BANK_TRANSFER) {
      if (method.accountNumber) {
        inferredBankAccountType = BankAccountType.ACCOUNT_NUMBER;
      } else if (method.clabe) {
        inferredBankAccountType = BankAccountType.CLABE;
      } else if (method.cardNumber) {
        inferredBankAccountType = BankAccountType.CARD;
      }
    }

    // ✅ Usar patchValue sin { emitEvent: false } para que detecte cambios
    this.form.patchValue({
      paymentType: method.paymentType,
      bank: method.bank,
      bankAccountType: inferredBankAccountType,
      accountNumber: method.accountNumber || '',
      clabe: method.clabe || '',
      cardNumber: method.cardNumber || '',
      accountHolder: method.accountHolder || '',
      isActive: method.isActive,
      isPrimary: method.isPrimary
    });

    // Disparar validaciones
    if (inferredBankAccountType) {
      setTimeout(() => this.onBankAccountTypeChange(), 0);
    }
  }

  private updateValidators(paymentType: PaymentType): void {
    const bankControl = this.form.get('bank');
    const bankAccountTypeControl = this.form.get('bankAccountType');
    const accountNumberControl = this.form.get('accountNumber');
    const clabeControl = this.form.get('clabe');
    const cardNumberControl = this.form.get('cardNumber');

    // Reset validators
    bankControl?.clearValidators();
    bankAccountTypeControl?.clearValidators();
    accountNumberControl?.clearValidators();
    clabeControl?.clearValidators();
    cardNumberControl?.clearValidators();

    // Apply validators based on payment type
    switch (paymentType) {
      case PaymentType.BANK_TRANSFER:
        bankControl?.setValidators([Validators.required]);
        bankAccountTypeControl?.setValidators([Validators.required]);
        break;

      case PaymentType.CLABE:
        bankControl?.setValidators([Validators.required]);
        clabeControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{18}$/),
          Validators.minLength(18),
          Validators.maxLength(18)
        ]);
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

    // Update validity
    bankControl?.updateValueAndValidity();
    bankAccountTypeControl?.updateValueAndValidity();
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

  showBankAccountTypeSelector(): boolean {
    return this.form.get('paymentType')?.value === PaymentType.BANK_TRANSFER;
  }

  onBankAccountTypeChange(): void {
    const bankAccountType = this.form.get('bankAccountType')?.value;
    const accountNumberControl = this.form.get('accountNumber');
    const clabeControl = this.form.get('clabe');
    const cardNumberControl = this.form.get('cardNumber');

    // Limpiar validadores
    accountNumberControl?.clearValidators();
    clabeControl?.clearValidators();
    cardNumberControl?.clearValidators();

    // Limpiar valores de los otros campos
    accountNumberControl?.setValue('', { emitEvent: false });
    clabeControl?.setValue('', { emitEvent: false });
    cardNumberControl?.setValue('', { emitEvent: false });

    // Aplicar validadores según el tipo seleccionado
    switch (bankAccountType) {
      case BankAccountType.ACCOUNT_NUMBER:
        accountNumberControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{10,18}$/),
          Validators.minLength(10),
          Validators.maxLength(18)
        ]);
        break;

      case BankAccountType.CLABE:
        clabeControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{18}$/),
          Validators.minLength(18),
          Validators.maxLength(18)
        ]);
        break;

      case BankAccountType.CARD:
        cardNumberControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{16}$/),
          Validators.minLength(16),
          Validators.maxLength(16)
        ]);
        break;
    }

    accountNumberControl?.updateValueAndValidity();
    clabeControl?.updateValueAndValidity();
    cardNumberControl?.updateValueAndValidity();
  }

  showAccountNumber(): boolean {
    const paymentType = this.form.get('paymentType')?.value;
    const bankAccountType = this.form.get('bankAccountType')?.value;
    
    return paymentType === PaymentType.BANK_TRANSFER && 
           bankAccountType === BankAccountType.ACCOUNT_NUMBER;
  }

  showClabe(): boolean {
    const paymentType = this.form.get('paymentType')?.value;
    const bankAccountType = this.form.get('bankAccountType')?.value;
    
    return (paymentType === PaymentType.CLABE) ||
           (paymentType === PaymentType.BANK_TRANSFER && bankAccountType === BankAccountType.CLABE);
  }

  showCardNumber(): boolean {
    const paymentType = this.form.get('paymentType')?.value;
    const bankAccountType = this.form.get('bankAccountType')?.value;
    
    return (paymentType === PaymentType.DEBIT_CARD || paymentType === PaymentType.CREDIT_CARD) ||
           (paymentType === PaymentType.BANK_TRANSFER && bankAccountType === BankAccountType.CARD);
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

  getBankAccountTypeName(type: BankAccountType): string {
    const names: Record<BankAccountType, string> = {
      [BankAccountType.ACCOUNT_NUMBER]: 'Número de Cuenta',
      [BankAccountType.CLABE]: 'CLABE Interbancaria',
      [BankAccountType.CARD]: 'Tarjeta'
    };
    return names[type] || type;
  }

  getBankAccountTypeIcon(type: BankAccountType): string {
    const icons: Record<BankAccountType, string> = {
      [BankAccountType.ACCOUNT_NUMBER]: 'fas fa-hashtag',
      [BankAccountType.CLABE]: 'fas fa-barcode',
      [BankAccountType.CARD]: 'fas fa-credit-card'
    };
    return icons[type] || 'fas fa-money-check-alt';
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
      bankAccountType: formValue.bankAccountType || undefined,
      accountNumber: formValue.accountNumber || undefined,
      clabe: formValue.clabe || undefined,
      cardNumber: formValue.cardNumber || undefined,
      accountHolder: formValue.accountHolder,
      isActive: formValue.isActive,
      isPrimary: formValue.isPrimary
    };

    this.save.emit(dto);
    // ✅ NO resetear isSaving aquí, se resetea en el effect cuando se cierra el form
  }

  onCancel(): void {
    this.cancel.emit();
  }
}