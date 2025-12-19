import { Component, Input, Output, EventEmitter, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RaffleSettings } from '../../../../shared/models/raffle-settings.model';

@Component({
  selector: 'app-general-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-config.component.html',
  styleUrl: './general-config.component.scss'
})
export class GeneralConfigComponent implements OnInit {
  @Input() raffleSettings: RaffleSettings | null = null;
  @Input() isLoading = false;
  @Output() save = new EventEmitter<any>();

  generalForm!: FormGroup;
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    // Efecto para actualizar el formulario cuando cambian los datos
    effect(() => {
      if (this.raffleSettings && this.generalForm) {
        this.generalForm.patchValue({
          minutesToClose: this.raffleSettings.minutesToClose,
          ticketsPerPage: this.raffleSettings.ticketsPerPage,
          luckyMachineOptions: this.raffleSettings.luckyMachineOptions
        });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.generalForm = this.fb.group({
      minutesToClose: [30, [Validators.required, Validators.min(5), Validators.max(120)]],
      ticketsPerPage: [50, [Validators.required, Validators.min(10), Validators.max(200)]],
      luckyMachineOptions: ['1,2,3,4,5,6,7,8,9,10', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.generalForm.valid) {
      this.save.emit(this.generalForm.value);
      this.successMessage.set('Configuración general guardada correctamente');
      setTimeout(() => this.successMessage.set(null), 3000);
    } else {
      this.errorMessage.set('Por favor, corrige los errores en el formulario');
      setTimeout(() => this.errorMessage.set(null), 3000);
    }
  }

  // Getters para facilitar acceso en el template
  get minutesToClose() { return this.generalForm.get('minutesToClose'); }
  get ticketsPerPage() { return this.generalForm.get('ticketsPerPage'); }
  get luckyMachineOptions() { return this.generalForm.get('luckyMachineOptions'); }
}