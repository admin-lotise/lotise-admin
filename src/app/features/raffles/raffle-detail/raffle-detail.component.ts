import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Raffle } from '../../../shared/models/raffle.model';
import { RafflesApiService } from '../../../core/http/raffles-api.service';
import { RAFFLE_TABS, RaffleTab, TabItem, RaffleStats } from '../../../shared/models/raffle-detail.model';

// ==================== IMPORTAR LOS TABS ====================
import { PaymentsTabComponent } from './tabs/payments-tab/payments-tab.component';
import { ParticipantsTabComponent } from './tabs/participants-tab/participants-tab.component';
import { TicketsTabComponent } from './tabs/tickets-tab/tickets-tab.component';
import { HistoryTabComponent } from './tabs/history-tab/history-tab.component';

@Component({
  selector: 'app-raffle-detail',
  standalone: true,
  imports: [
    CommonModule,
    // ==================== AGREGAR LOS TABS A LOS IMPORTS ====================
    PaymentsTabComponent,
    ParticipantsTabComponent,
    TicketsTabComponent,
    HistoryTabComponent
  ],
  templateUrl: './raffle-detail.component.html',
  styleUrl: './raffle-detail.component.scss'
})
export class RaffleDetailComponent implements OnInit {
  // Data signals
  raffleId = signal<string | null>(null);
  raffle = signal<Raffle | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Tab management
  activeTab = signal<RaffleTab>('overview');
  tabs = signal<TabItem[]>(RAFFLE_TABS);

  // Stats computadas
  stats = computed<RaffleStats | null>(() => {
    const raffleData = this.raffle();
    if (!raffleData) return null;

    return {
      totalTickets: raffleData.totalTickets,
      soldTickets: raffleData.soldTickets,
      availableTickets: raffleData.totalTickets - raffleData.soldTickets,
      revenue: raffleData.soldTickets * raffleData.baseTicketPrice,
      participants: 0, // TODO: Get from participants data
      daysRemaining: this.calculateDaysRemaining(raffleData.drawDate)
    };
  });

  // Progress percentage
  progressPercentage = computed(() => {
    const raffleData = this.raffle();
    if (!raffleData) return 0;
    return (raffleData.soldTickets / raffleData.totalTickets) * 100;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rafflesApi: RafflesApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.raffleId.set(this.route.snapshot.paramMap.get('id'));
    
    if (this.raffleId()) {
      await this.loadRaffle();
    }
  }

  async loadRaffle(): Promise<void> {
    const id = this.raffleId();
    if (!id) return;

    try {
      this.isLoading.set(true);
      this.error.set(null);

      const tenantId = 'tenant-demo';
      const raffle = await firstValueFrom(
        this.rafflesApi.getRaffle(tenantId, id)
      );

      this.raffle.set(raffle);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar la rifa');
      console.error('Error loading raffle:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Tab navigation
  setActiveTab(tab: RaffleTab): void {
    this.activeTab.set(tab);
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/raffles']);
  }

  onEdit(): void {
    this.router.navigate(['/raffles', this.raffleId(), 'edit']);
  }

  onManageTickets(): void {
    this.router.navigate(['/raffles', this.raffleId(), 'tickets']);
  }

  // Actions
  async onPause(): Promise<void> {
    console.log('Pausar rifa');
    // TODO: Implement pause logic
  }

  async onCancel(): Promise<void> {
    console.log('Cancelar rifa');
    // TODO: Implement cancel logic
  }

  async onDraw(): Promise<void> {
    console.log('Realizar sorteo');
    // TODO: Implement draw logic
  }

  async onDuplicate(): Promise<void> {
    console.log('Duplicar rifa');
    // TODO: Implement duplicate logic
  }

  // Helpers
  private calculateDaysRemaining(drawDate: Date | string): number {
    const now = new Date();
    const draw = typeof drawDate === 'string' ? new Date(drawDate) : drawDate;
    const diff = draw.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Status helpers
  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'active': 'status-active',
      'scheduled': 'status-scheduled',
      'draft': 'status-draft',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-draft';
  }

  getStatusLabel(status: string): string {
    const labelMap: Record<string, string> = {
      'active': 'Activa',
      'scheduled': 'Programada',
      'draft': 'Borrador',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return labelMap[status] || status;
  }
}