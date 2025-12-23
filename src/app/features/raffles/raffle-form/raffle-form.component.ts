import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { RafflesApiService } from '../../../core/http/raffles-api.service';
import { RafflesStateService } from '../../../core/signals/raffles-state.service';
import { 
  Raffle, 
  CreateRaffleDto, 
  UpdateRaffleDto, 
  RaffleType,
  LotteryType,
  RafflePrize
} from '../../../shared/models/raffle.model';

@Component({
  selector: 'app-raffle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './raffle-form.component.html',
  styleUrl: './raffle-form.component.scss'
})
export class RaffleFormComponent implements OnInit {
  // Signals
  raffleId = signal<string | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  currentStep = signal(1);
  totalSteps = 7;

  // Formulario
  raffleForm!: FormGroup;

  // Enums para el template
  RaffleType = RaffleType;
  LotteryType = LotteryType;

  // Listas para selectores
  lotteryOptions = [
    { value: LotteryType.LOTERIA_NACIONAL, label: 'Lotería Nacional' },
    { value: LotteryType.MELATE, label: 'Melate' },
    { value: LotteryType.CHISPAZO, label: 'Chispazo' },
    { value: LotteryType.TRIS, label: 'Tris' },
    { value: LotteryType.CUSTOM, label: 'Personalizado' }
  ];

  // Computed
  formTitle = computed(() => 
    this.isEditing() ? 'Editar Rifa' : 'Nueva Rifa'
  );

  canGoNext = computed(() => {
    const step = this.currentStep();
    switch (step) {
      case 1: return this.basicInfoGroup.valid;
      case 2: return this.prizesArray.length > 0 && this.prizesArray.valid;
      case 3: return this.ticketsGroup.valid;
      case 4: return this.datesGroup.valid;
      case 5: return true; // Oportunidades es opcional
      case 6: return true; // Textos adicionales es opcional
      case 7: return true; // FAQs es opcional
      default: return false;
    }
  });

  canSubmit = computed(() => {
    return this.raffleForm.valid && !this.isSaving();
  });

  progressPercentage = computed(() => {
    return (this.currentStep() / this.totalSteps) * 100;
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rafflesApi: RafflesApiService,
    private rafflesState: RafflesStateService
  ) {
    this.initForm();
  }

  async ngOnInit(): Promise<void> {
    this.raffleId.set(this.route.snapshot.paramMap.get('id'));
    this.isEditing.set(!!this.raffleId());

    if (this.isEditing() && this.raffleId()) {
      await this.loadRaffle();
    }
  }

  /**
   * Inicializar formulario
   */
  private initForm(): void {
    this.raffleForm = this.fb.group({
      // Paso 1: Información básica
      basicInfo: this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
        categoryId: [''],
        images: this.fb.array([])
      }),

      // Paso 2: Premios
      prizes: this.fb.array([]),

      // Paso 3: Configuración de boletos
      tickets: this.fb.group({
        totalTickets: [100, [Validators.required, Validators.min(10), Validators.max(100000)]],
        baseTicketPrice: [10, [Validators.required, Validators.min(1), Validators.max(100000)]],
        comboPrices: this.fb.array([]),
        maxTicketsPerPerson: [null, [Validators.min(1)]]
      }),

      // Paso 4: Sorteo y fechas
      dates: this.fb.group({
        lottery: [LotteryType.LOTERIA_NACIONAL, Validators.required],
        drawDate: ['', Validators.required],
        coveredUntil: [''],
        raffleType: [RaffleType.DIGITAL]
      }),

      // Paso 5: Oportunidades
      opportunities: this.fb.group({
        enabled: [false],
        count: [0, [Validators.min(0), Validators.max(10)]]
      }),

      // Paso 6: Textos adicionales
      additionalTexts: this.fb.group({
        additionalInfo: [''],
        participationRules: [''],
        deliveryTerms: [''],
        disclaimer: ['']
      }),

      // Paso 7: FAQs
      faqs: this.fb.array([])
    });

    // Agregar un premio por defecto
    this.addPrize();
  }

  /**
   * Cargar rifa existente
   */
  private async loadRaffle(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const tenantId = 'tenant-demo';
      const raffle = await firstValueFrom(
        this.rafflesApi.getRaffle(tenantId, this.raffleId()!)
      );

      this.populateForm(raffle);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar la rifa');
      console.error('Error loading raffle:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Poblar formulario con datos de rifa existente
   */
  private populateForm(raffle: Raffle): void {
    // Información básica
    this.basicInfoGroup.patchValue({
      title: raffle.title,
      description: raffle.description,
      categoryId: raffle.categoryId
    });

    // Imágenes
    if (raffle.images && raffle.images.length > 0) {
      raffle.images.forEach(url => this.addImage(url));
    }

    // Premios
    this.prizesArray.clear();
    raffle.prizes.forEach(prize => this.addPrize(prize));

    // Boletos
    this.ticketsGroup.patchValue({
      totalTickets: raffle.totalTickets,
      baseTicketPrice: raffle.baseTicketPrice,
      maxTicketsPerPerson: raffle.maxTicketsPerPerson
    });

    // Combos
    if (raffle.comboPrices && raffle.comboPrices.length > 0) {
      raffle.comboPrices.forEach(combo => this.addCombo(combo));
    }

    // Fechas
    this.datesGroup.patchValue({
      lottery: raffle.lottery,
      drawDate: this.formatDateForInput(raffle.drawDate),
      coveredUntil: raffle.coveredUntil ? this.formatDateForInput(raffle.coveredUntil) : '',
      raffleType: raffle.raffleType
    });

    // Oportunidades
    this.opportunitiesGroup.patchValue({
      enabled: raffle.opportunitiesEnabled,
      count: raffle.opportunitiesCount || 0
    });

    // Textos adicionales
    if (raffle.additionalTexts) {
      this.additionalTextsGroup.patchValue(raffle.additionalTexts);
    }

    // FAQs
    if (raffle.faqs && raffle.faqs.length > 0) {
      raffle.faqs.forEach(faq => this.addFaq(faq));
    }
  }

  /**
   * Formatear fecha para input type="date"
   */
  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // ==================== GETTERS DE FORM GROUPS ====================

  get basicInfoGroup(): FormGroup {
    return this.raffleForm.get('basicInfo') as FormGroup;
  }

  get ticketsGroup(): FormGroup {
    return this.raffleForm.get('tickets') as FormGroup;
  }

  get datesGroup(): FormGroup {
    return this.raffleForm.get('dates') as FormGroup;
  }

  get opportunitiesGroup(): FormGroup {
    return this.raffleForm.get('opportunities') as FormGroup;
  }

  get additionalTextsGroup(): FormGroup {
    return this.raffleForm.get('additionalTexts') as FormGroup;
  }

  get imagesArray(): FormArray {
    return this.basicInfoGroup.get('images') as FormArray;
  }

  get prizesArray(): FormArray {
    return this.raffleForm.get('prizes') as FormArray;
  }

  get comboPricesArray(): FormArray {
    return this.ticketsGroup.get('comboPrices') as FormArray;
  }

  get faqsArray(): FormArray {
    return this.raffleForm.get('faqs') as FormArray;
  }

  // ==================== MANEJO DE IMÁGENES ====================

  addImage(url: string = ''): void {
    this.imagesArray.push(this.fb.control(url, Validators.required));
  }

  removeImage(index: number): void {
    this.imagesArray.removeAt(index);
  }

  onImageUrlChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imagesArray.at(index).setValue(input.value);
  }

  // ==================== MANEJO DE PREMIOS ====================

  addPrize(prize?: RafflePrize): void {
    const prizeGroup = this.fb.group({
      name: [prize?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [prize?.description || '', Validators.maxLength(200)],
      estimatedValue: [prize?.estimatedValue || 0, [Validators.required, Validators.min(1)]],
      position: [prize?.position || this.prizesArray.length + 1, Validators.required],
      imageUrl: [prize?.imageUrl || '']
    });

    this.prizesArray.push(prizeGroup);
  }

  removePrize(index: number): void {
    this.prizesArray.removeAt(index);
    // Reordenar posiciones
    this.prizesArray.controls.forEach((control, i) => {
      control.get('position')?.setValue(i + 1);
    });
  }

  // ==================== MANEJO DE COMBOS ====================

  addCombo(combo?: { quantity: number; price: number }): void {
    const comboGroup = this.fb.group({
      quantity: [combo?.quantity || 3, [Validators.required, Validators.min(2)]],
      totalPrice: [combo?.price || 0, [Validators.required, Validators.min(1)]]
    });

    this.comboPricesArray.push(comboGroup);
  }

  removeCombo(index: number): void {
    this.comboPricesArray.removeAt(index);
  }

  calculateDiscount(combo: any): number {
    const basePrice = this.ticketsGroup.get('baseTicketPrice')?.value || 0;
    const totalNormal = combo.quantity * basePrice;
    const discount = ((totalNormal - combo.totalPrice) / totalNormal) * 100;
    return Math.round(discount);
  }

  // ==================== MANEJO DE FAQs ====================

  addFaq(faq?: { question: string; answer: string }): void {
    const faqGroup = this.fb.group({
      question: [faq?.question || '', [Validators.required, Validators.maxLength(200)]],
      answer: [faq?.answer || '', [Validators.required, Validators.maxLength(500)]]
    });

    this.faqsArray.push(faqGroup);
  }

  removeFaq(index: number): void {
    this.faqsArray.removeAt(index);
  }

  // ==================== NAVEGACIÓN DE PASOS ====================

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep.set(step);
    }
  }

  nextStep(): void {
    if (this.canGoNext() && this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  // ==================== GUARDAR ====================

  async onSubmit(): Promise<void> {
    if (!this.raffleForm.valid) {
      this.markFormGroupTouched(this.raffleForm);
      this.error.set('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      this.isSaving.set(true);
      this.error.set(null);

      const tenantId = 'tenant-demo';
      const formValue = this.raffleForm.value;

      if (this.isEditing() && this.raffleId()) {
        // Actualizar rifa existente
        const updateDto: UpdateRaffleDto = this.buildUpdateDto(formValue);
        
        const updated = await firstValueFrom(
          this.rafflesApi.updateRaffle(tenantId, this.raffleId()!, updateDto)
        );

        this.rafflesState.updateRaffle(this.raffleId()!, updated);
        
        // TODO: Mostrar toast de éxito
        this.router.navigate(['/raffles', this.raffleId()]);
      } else {
        // Crear nueva rifa
        const createDto: CreateRaffleDto = this.buildCreateDto(formValue);
        
        const created = await firstValueFrom(
          this.rafflesApi.createRaffle(tenantId, createDto)
        );

        this.rafflesState.addRaffle(created);
        
        // TODO: Mostrar toast de éxito
        this.router.navigate(['/raffles', created.id]);
      }
    } catch (err: any) {
      this.error.set(err?.message || 'Error al guardar la rifa');
      console.error('Error saving raffle:', err);
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Construir DTO para crear rifa
   */
  private buildCreateDto(formValue: any): CreateRaffleDto {
    return {
      tenantId: 'tenant-demo',
      categoryId: formValue.basicInfo.categoryId || undefined,
      
      // Básico
      title: formValue.basicInfo.title,
      description: formValue.basicInfo.description,
      images: formValue.basicInfo.images.filter((url: string) => url.trim()),
      
      // Precios y boletos
      baseTicketPrice: formValue.tickets.baseTicketPrice,
      comboPrices: formValue.tickets.comboPrices,
      totalTickets: formValue.tickets.totalTickets,
      
      // Lotería y fechas
      lottery: formValue.dates.lottery,
      drawDate: formValue.dates.drawDate,
      coveredUntil: formValue.dates.coveredUntil || undefined,
      
      // Oportunidades
      opportunitiesEnabled: formValue.opportunities.enabled,
      opportunitiesCount: formValue.opportunities.enabled ? formValue.opportunities.count : undefined,
      
      // Premios
      prizes: formValue.prizes,
      
      // FAQs
      faqs: formValue.faqs.length > 0 ? formValue.faqs : undefined,
      
      // Textos adicionales
      additionalTexts: this.hasAdditionalTexts(formValue.additionalTexts) 
        ? formValue.additionalTexts 
        : undefined,
      
      // Configuración
      raffleType: formValue.dates.raffleType,
      maxTicketsPerPerson: formValue.tickets.maxTicketsPerPerson || undefined,
      allowReservations: true,
      reservationTimeMinutes: 15
    };
  }

  /**
   * Construir DTO para actualizar rifa
   */
  private buildUpdateDto(formValue: any): UpdateRaffleDto {
    return this.buildCreateDto(formValue) as UpdateRaffleDto;
  }

  /**
   * Verificar si hay textos adicionales
   */
  private hasAdditionalTexts(texts: any): boolean {
    return !!(texts.additionalInfo || texts.participationRules || 
              texts.deliveryTerms || texts.disclaimer);
  }

  /**
   * Marcar todos los campos como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  // ==================== NAVEGACIÓN ====================

  goBack(): void {
    if (confirm('¿Estás seguro de salir? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/raffles']);
    }
  }

  cancel(): void {
    this.goBack();
  }
}