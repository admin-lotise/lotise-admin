import { Component, Input, Output, EventEmitter, signal, effect, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebPageConfig } from '../../../../shared/models/raffle-settings.model';

@Component({
  selector: 'app-timing-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timing-settings.component.html',
  styleUrl: './timing-settings.component.scss'
})
export class TimingSettingsComponent implements OnInit {
  @Input() webPageConfig: WebPageConfig | null = null;
  @Input() isLoading = false;
  @Output() save = new EventEmitter<any>();

  timingForm!: FormGroup;
  successMessage = signal<string | null>(null);

  // Computed signals para preview de colores
  primaryColor = computed(() => this.timingForm?.get('primaryColor')?.value || '#ff497c');
  primaryColorContrast = computed(() => this.timingForm?.get('primaryColorContrast')?.value || '#ffffff');
  secondaryColor = computed(() => this.timingForm?.get('secondaryColor')?.value || '#3b82f6');
  secondaryColorContrast = computed(() => this.timingForm?.get('secondaryColorContrast')?.value || '#ffffff');

  constructor(private fb: FormBuilder) {
    // Efecto para actualizar el formulario cuando cambian los datos
    effect(() => {
      if (this.webPageConfig && this.timingForm) {
        this.timingForm.patchValue({
          primaryColor: this.webPageConfig.primaryColor,
          primaryColorContrast: this.webPageConfig.primaryColorContrast,
          secondaryColor: this.webPageConfig.secondaryColor,
          secondaryColorContrast: this.webPageConfig.secondaryColorContrast
        });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.timingForm = this.fb.group({
      primaryColor: ['#ff497c', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      primaryColorContrast: ['#ffffff', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      secondaryColor: ['#3b82f6', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      secondaryColorContrast: ['#ffffff', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
    });

    // Emitir cambios para actualizar preview en tiempo real
    this.timingForm.valueChanges.subscribe(() => {
      // Forzar actualización de computed signals
    });
  }

  onSubmit(): void {
    if (this.timingForm.valid) {
      this.save.emit(this.timingForm.value);
      this.successMessage.set('Colores actualizados correctamente');
      setTimeout(() => this.successMessage.set(null), 3000);
    }
  }

  // Getters para facilitar acceso en el template
  get primaryColorControl() { return this.timingForm.get('primaryColor'); }
  get primaryColorContrastControl() { return this.timingForm.get('primaryColorContrast'); }
  get secondaryColorControl() { return this.timingForm.get('secondaryColor'); }
  get secondaryColorContrastControl() { return this.timingForm.get('secondaryColorContrast'); }
}