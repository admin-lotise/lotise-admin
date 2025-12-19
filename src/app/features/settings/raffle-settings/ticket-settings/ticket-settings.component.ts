import { Component, Input, Output, EventEmitter, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WebPageConfig } from '../../../../shared/models/raffle-settings.model';

@Component({
  selector: 'app-ticket-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-settings.component.html',
  styleUrl: './ticket-settings.component.scss'
})
export class TicketSettingsComponent implements OnInit {
  @Input() webPageConfig: WebPageConfig | null = null;
  @Input() isLoading = false;
  @Output() save = new EventEmitter<any>();

  ticketForm!: FormGroup;
  successMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    // Efecto para actualizar el formulario cuando cambian los datos
    effect(() => {
      if (this.webPageConfig && this.ticketForm) {
        this.ticketForm.patchValue({
          showVerifier: this.webPageConfig.showVerifier,
          showParticipants: this.webPageConfig.showParticipants,
          showTimer: this.webPageConfig.showTimer,
          showTicketsSold: this.webPageConfig.showTicketsSold,
          showPrivacyPolicy: this.webPageConfig.showPrivacyPolicy,
          showTerms: this.webPageConfig.showTerms,
          openWhatsAppDirect: this.webPageConfig.openWhatsAppDirect
        });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.ticketForm = this.fb.group({
      showVerifier: [true],
      showParticipants: [true],
      showTimer: [true],
      showTicketsSold: [true],
      showPrivacyPolicy: [false],
      showTerms: [false],
      openWhatsAppDirect: [false]
    });
  }

  onSubmit(): void {
    this.save.emit(this.ticketForm.value);
    this.successMessage.set('Elementos visibles actualizados correctamente');
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  // Getters para facilitar acceso en el template
  get showVerifier() { return this.ticketForm.get('showVerifier'); }
  get showParticipants() { return this.ticketForm.get('showParticipants'); }
  get showTimer() { return this.ticketForm.get('showTimer'); }
  get showTicketsSold() { return this.ticketForm.get('showTicketsSold'); }
  get showPrivacyPolicy() { return this.ticketForm.get('showPrivacyPolicy'); }
  get showTerms() { return this.ticketForm.get('showTerms'); }
  get openWhatsAppDirect() { return this.ticketForm.get('openWhatsAppDirect'); }
}