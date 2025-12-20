import { Component, Input, Output, EventEmitter, signal, computed, effect, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentMethod, PaymentType, Bank, CreatePaymentMethodDto, BANK_LOGOS } from '../../../../shared/models/payment-method.model';

@Component({
  selector: 'app-payment-method-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-method-form.component.html',
  styleUrl: './payment-method-form.component.scss'
})
export class PaymentMethodFormComponent implements OnInit {
  @Input() paymentMethod: PaymentMethod | null = null;
  @Output() save = new EventEmitter<CreatePaymentMethodDto>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  // Form
  form!: FormGroup;

  // Enums para el template
  PaymentType = PaymentType;
  Bank = Bank;
  BANK_LOGOS = BANK_LOGOS;

  // Arrays para los selects
  paymentTypes = Object.values(PaymentType);
  banks = Object.values(Bank);

  // Estado
  isSaving = signal(false);
  error = signal<string | null>(null);

  // Computed para mostrar campos dinámicos
  selectedPaymentType = signal<PaymentType>(PaymentType.BANK_TRANSFER);

  showAccountNumber = computed(() => 
    this.selectedPaymentType() === PaymentType.BANK_TRANSFER ||
    this.selectedPaymentType() === PaymentType.DEBIT_CARD
  );

  showClabe = computed(() => 
    this.selectedPaymentType() === PaymentType.CLABE
  );

  showCardNumber = computed(() => 
    this.selectedPaymentType() === PaymentType.DEBIT_CARD ||
    this.selectedPaymentType() === PaymentType.CREDIT_CARD
  );

  showBankSelect = computed(() => 
    this.selectedPaymentType() !== PaymentType.CASH &&
    this.selectedPaymentType() !== PaymentType.PAYPAL &&
    this.selectedPaymentType() !== PaymentType.MERCADO_PAGO
  );

  // Effect para actualizar validaciones cuando cambia el tipo de pago
  constructor() {
    effect(() => {
      const paymentType = this.selectedPaymentType();
      if (this.form) {
        this.updateValidations(paymentType);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    
    // Si estamos editando, llenar el formulario
    if (this.paymentMethod) {
      this.populateForm(this.paymentMethod);
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.form = this.fb.group({
      paymentType: [PaymentType.BANK_TRANSFER, Validators.required],
      bank: [Bank.BBVA, Validators.required],
      accountNumber: [''],
      clabe: [''],
      cardNumber: [''],
      accountHolder: ['', [Validators.required, Validators.minLength(3)]],
      isActive: [true],
      isPrimary: [false]
    });

    // Escuchar cambios en paymentType
    this.form.get('paymentType')?.valueChanges.subscribe(type => {
      this.selectedPaymentType.set(type);
    });
  }

  /**
   * Poblar formulario con datos existentes
   */
  private populateForm(method: PaymentMethod): void {
    this.selectedPaymentType.set(method.paymentType);
    
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

  /**
   * Actualizar validaciones según tipo de pago
   */
  private updateValidations(paymentType: PaymentType): void {
    const accountNumberControl = this.form.get('accountNumber');
    const clabeControl = this.form.get('clabe');
    const cardNumberControl = this.form.get('cardNumber');
    const bankControl = this.form.get('bank');

    // Resetear validaciones
    accountNumberControl?.clearValidators();
    clabeControl?.clearValidators();
    cardNumberControl?.clearValidators();
    bankControl?.clearValidators();

    // Aplicar validaciones según tipo
    switch (paymentType) {
      case PaymentType.BANK_TRANSFER:
        accountNumberControl?.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(18)]);
        bankControl?.setValidators([Validators.required]);
        break;

      case PaymentType.CLABE:
        clabeControl?.setValidators([Validators.required, Validators.minLength(18), Validators.maxLength(18), Validators.pattern(/^\d{18}$/)]);
        bankControl?.setValidators([Validators.required]);
        break;

      case PaymentType.DEBIT_CARD:
        cardNumberControl?.setValidators([Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern(/^\d{16}$/)]);
        bankControl?.setValidators([Validators.required]);
        break;

      case PaymentType.CREDIT_CARD:
        cardNumberControl?.setValidators([Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern(/^\d{16}$/)]);
        bankControl?.setValidators([Validators.required]);
        break;

      case PaymentType.PAYPAL:
      case PaymentType.MERCADO_PAGO:
        // No requieren banco
        break;

      case PaymentType.CASH:
        // Efectivo no requiere campos adicionales
        break;
    }

    // Actualizar validez
    accountNumberControl?.updateValueAndValidity();
    clabeControl?.updateValueAndValidity();
    cardNumberControl?.updateValueAndValidity();
    bankControl?.updateValueAndValidity();
  }

  /**
   * Obtener ícono del tipo de pago
   */
  getPaymentTypeIcon(type: PaymentType): string {
    const icons = {
      [PaymentType.BANK_TRANSFER]: 'fas fa-exchange-alt',
      [PaymentType.CLABE]: 'fas fa-barcode',
      [PaymentType.DEBIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CREDIT_CARD]: 'fas fa-credit-card',
      [PaymentType.CASH]: 'fas fa-money-bill-wave',
      [PaymentType.PAYPAL]: 'fab fa-paypal',
      [PaymentType.MERCADO_PAGO]: 'fas fa-shopping-cart'
    };
    return icons[type] || 'fas fa-dollar-sign';
  }

  /**
   * Obtener nombre legible del tipo de pago
   */
  getPaymentTypeName(type: PaymentType): string {
    const names = {
      [PaymentType.BANK_TRANSFER]: 'Transferencia Bancaria',
      [PaymentType.CLABE]: 'CLABE Interbancaria',
      [PaymentType.DEBIT_CARD]: 'Tarjeta de Débito',
      [PaymentType.CREDIT_CARD]: 'Tarjeta de Crédito',
      [PaymentType.CASH]: 'Efectivo',
      [PaymentType.PAYPAL]: 'PayPal',
      [PaymentType.MERCADO_PAGO]: 'Mercado Pago'
    };
    return names[type] || type;
  }

  /**
   * Obtener logo del banco
   */
  getBankLogo(bank: Bank): string {
    return BANK_LOGOS[bank] || 'fas fa-university';
  }

  /**
   * Validar campo
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtener mensaje de error
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    if (field.errors['pattern']) {
      if (fieldName === 'clabe') return 'La CLABE debe tener exactamente 18 dígitos';
      if (fieldName === 'cardNumber') return 'La tarjeta debe tener 16 dígitos';
      return 'Formato inválido';
    }

    return 'Campo inválido';
  }

  /**
   * Formatear número de tarjeta mientras se escribe
   */
  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Solo dígitos
    
    if (value.length > 16) {
      value = value.substring(0, 16);
    }

    input.value = value;
    this.form.get('cardNumber')?.setValue(value, { emitEvent: false });
  }

  /**
   * Formatear CLABE mientras se escribe
   */
  onClabeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Solo dígitos
    
    if (value.length > 18) {
      value = value.substring(0, 18);
    }

    input.value = value;
    this.form.get('clabe')?.setValue(value, { emitEvent: false });
  }

  /**
   * Enviar formulario
   */
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    try {
      const formValue = this.form.value;
      
      // Construir DTO según el tipo de pago
      const dto: CreatePaymentMethodDto = {
        paymentType: formValue.paymentType,
        bank: this.showBankSelect() ? formValue.bank : undefined,
        accountNumber: this.showAccountNumber() ? formValue.accountNumber : undefined,
        clabe: this.showClabe() ? formValue.clabe : undefined,
        cardNumber: this.showCardNumber() ? formValue.cardNumber : undefined,
        accountHolder: formValue.accountHolder,
        isActive: formValue.isActive,
        isPrimary: formValue.isPrimary
      };

      this.save.emit(dto);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al guardar método de pago');
      console.error('Error saving payment method:', err);
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Cancelar
   */
  onCancel(): void {
    this.cancel.emit();
  }
}