import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// State Services
import { RafflesStateService } from '../../core/signals/raffles-state.service';
import { WinnersStateService } from '../../core/signals/winners-state.service';
import { StorageService, Tenant } from '../../core/auth/storage.service';

// API Services
import { RafflesApiService } from '../../core/http/raffles-api.service';
import { ParticipantsApiService } from '../../core/http/participants-api.service';

// Models
import { Raffle, RaffleStatus } from '../../shared/models/raffle.model';
import { Participant } from '../../shared/models/ticket.model';

type PlanType = 'BASICO' | 'EMPRENDEDOR' | 'PROFESIONAL';

interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  amount?: number;
  icon: string;
  color: string;
  isPremium: boolean;
  route?: string;
  description?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  // ==================== SERVICES ====================
  private readonly rafflesState = inject(RafflesStateService);
  private readonly winnersState = inject(WinnersStateService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  
  // API Services
  private readonly rafflesApi = inject(RafflesApiService);
  private readonly participantsApi = inject(ParticipantsApiService);

  // ==================== STATE ====================
  readonly isLoading = signal(true);
  readonly selectedRaffleId = signal<string>('all');
  readonly tenant = signal<Tenant | null>(null);
  
  // ✅ Almacenar participantes cargados
  private readonly participantsCache = signal<Participant[]>([]);

  // ✅ NUEVO: Filtro de fechas
  readonly dateFilter = signal<'all' | 'week' | 'month' | 'year'>('month');

  // ==================== COMPUTED: USER PLAN ====================
  readonly userPlan = computed<PlanType>(() => {
    const tenantData = this.tenant();
    if (!tenantData?.planName) return 'BASICO';
    
    const planName = tenantData.planName.toUpperCase();
    if (planName.includes('PROFESIONAL')) return 'PROFESIONAL';
    if (planName.includes('EMPRENDEDOR')) return 'EMPRENDEDOR';
    return 'BASICO';
  });

  readonly isPremiumPlan = computed(() => 
    this.userPlan() === 'EMPRENDEDOR' || this.userPlan() === 'PROFESIONAL'
  );

  readonly isProfessionalPlan = computed(() => 
    this.userPlan() === 'PROFESIONAL'
  );

  // ==================== COMPUTED: RAFFLES ====================
  readonly raffles = this.rafflesState.raffles;
  
  // ✅ NUEVO: Filtrar rifas por fecha
  readonly filteredByDate = computed(() => {
    const allRaffles = this.raffles();
    const filter = this.dateFilter();
    
    if (filter === 'all') return allRaffles;

    const now = new Date();
    const filterDate = new Date();

    switch (filter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return allRaffles.filter(raffle => {
      const createdAt = new Date(raffle.createdAt);
      return createdAt >= filterDate;
    });
  });

  readonly activeRaffles = computed(() => 
    this.filteredByDate().filter(r => r.status === RaffleStatus.ACTIVE)
  );
  
  readonly scheduledRaffles = computed(() => 
    this.filteredByDate().filter(r => r.status === RaffleStatus.SCHEDULED)
  );
  
  readonly pausedRaffles = computed(() => 
    this.filteredByDate().filter(r => r.status === RaffleStatus.PAUSED)
  );
  
  readonly completedRaffles = computed(() => 
    this.filteredByDate().filter(r => r.status === RaffleStatus.COMPLETED)
  );

  // ==================== COMPUTED: SELECTED RAFFLE ====================
  readonly selectedRaffle = computed(() => {
    const id = this.selectedRaffleId();
    if (id === 'all') return null;
    return this.filteredByDate().find(r => r.id === id) || null;
  });

  readonly filteredRaffles = computed(() => {
    const selected = this.selectedRaffle();
    return selected ? [selected] : this.filteredByDate();
  });

  // ==================== COMPUTED: TICKETS METRICS ====================
  readonly ticketsMetrics = computed(() => {
    const raffles = this.filteredRaffles();
    
    return raffles.reduce((acc, raffle) => ({
      sold: acc.sold + (raffle.soldTickets || 0),
      reserved: acc.reserved + (raffle.reservedTickets || 0),
      available: acc.available + (raffle.availableTickets || 0),
      total: acc.total + (raffle.totalTickets || 0)
    }), { sold: 0, reserved: 0, available: 0, total: 0 });
  });

  // ==================== COMPUTED: REVENUE (PREMIUM) ====================
  readonly revenue = computed(() => {
    if (!this.isPremiumPlan()) return 0;
    
    const raffles = this.filteredRaffles();
    return raffles.reduce((acc, raffle) => {
      const ticketRevenue = (raffle.soldTickets || 0) * (raffle.baseTicketPrice || 0);
      return acc + ticketRevenue;
    }, 0);
  });

  readonly projectedRevenue = computed(() => {
    if (!this.isPremiumPlan()) return 0;
    
    const raffles = this.filteredRaffles();
    return raffles.reduce((acc, raffle) => {
      const potential = (raffle.totalTickets || 0) * (raffle.baseTicketPrice || 0);
      return acc + potential;
    }, 0);
  });

  // ==================== COMPUTED: PARTICIPANTS ====================
  readonly totalParticipants = computed(() => {
    const participants = this.participantsCache();
    const raffles = this.filteredRaffles();
    
    if (raffles.length === 0 || this.selectedRaffleId() === 'all') {
      return participants.length;
    }
    
    const raffleIds = new Set(raffles.map(r => r.id));
    return participants.filter((p: Participant) => raffleIds.has(p.raffleId)).length;
  });

  // ==================== COMPUTED: WINNERS ====================
  readonly totalWinners = computed(() => {
    const winners = this.winnersState.winners();
    const raffles = this.filteredRaffles();
    
    if (raffles.length === 0 || this.selectedRaffleId() === 'all') {
      return winners.length;
    }
    
    const raffleIds = new Set(raffles.map(r => r.id));
    return winners.filter(w => raffleIds.has(w.raffleId)).length;
  });

  // ==================== COMPUTED: PROGRESS ====================
  readonly salesProgress = computed(() => {
    const tickets = this.ticketsMetrics();
    if (tickets.total === 0) return 0;
    return Math.round((tickets.sold / tickets.total) * 100);
  });

  // ==================== COMPUTED: METRICS GRID ====================
  readonly metrics = computed<DashboardMetric[]>(() => {
    const tickets = this.ticketsMetrics();

    return [
      {
        id: 'sold',
        label: 'Boletos Vendidos',
        value: tickets.sold.toLocaleString('es-MX'),
        icon: 'check_circle',
        color: 'sold',
        isPremium: false,
        description: `${this.salesProgress()}% de avance`
      },
      {
        id: 'reserved',
        label: 'Boletos Separados',
        value: tickets.reserved.toLocaleString('es-MX'),
        icon: 'schedule',
        color: 'reserved',
        isPremium: false,
        description: 'Pendientes de confirmación'
      },
      {
        id: 'available',
        label: 'Boletos Disponibles',
        value: tickets.available.toLocaleString('es-MX'),
        icon: 'confirmation_number',
        color: 'available',
        isPremium: false,
        description: 'Listos para vender'
      },
      {
        id: 'active',
        label: 'Rifas Activas',
        value: this.activeRaffles().length.toString(),
        icon: 'play_circle',
        color: 'active',
        isPremium: false,
        route: '/raffles',
        description: 'En venta ahora'
      },
      {
        id: 'scheduled',
        label: 'Rifas Programadas',
        value: this.scheduledRaffles().length.toString(),
        icon: 'event',
        color: 'scheduled',
        isPremium: false,
        description: 'Próximas a iniciar'
      },
      {
        id: 'paused',
        label: 'Rifas Pausadas',
        value: this.pausedRaffles().length.toString(),
        icon: 'pause_circle',
        color: 'paused',
        isPremium: false,
        description: 'Temporalmente detenidas'
      },
      {
        id: 'participants',
        label: 'Participantes',
        value: this.totalParticipants().toLocaleString('es-MX'),
        icon: 'people',
        color: 'participants',
        isPremium: false,
        description: 'Clientes registrados'
      },
      {
        id: 'winners',
        label: 'Ganadores',
        value: this.totalWinners().toLocaleString('es-MX'),
        icon: 'emoji_events',
        color: 'winners',
        isPremium: false,
        route: '/winners',
        description: 'Premios entregados'
      },
      {
        id: 'revenue',
        label: 'Ingresos Generados',
        value: this.formatCurrency(this.revenue()),
        amount: this.revenue(),
        icon: 'payments',
        color: 'revenue',
        isPremium: true,
        description: 'Boletos confirmados'
      },
      {
        id: 'projection',
        label: 'Proyección Total',
        value: this.formatCurrency(this.projectedRevenue()),
        amount: this.projectedRevenue(),
        icon: 'trending_up',
        color: 'projection',
        isPremium: true,
        description: 'Si se venden todos'
      }
    ];
  });

  readonly visibleMetrics = computed(() => {
    const allMetrics = this.metrics();
    if (this.isPremiumPlan()) {
      return allMetrics;
    }
    return allMetrics.filter(m => !m.isPremium);
  });

  // ==================== COMPUTED: RAFFLE OPTIONS ====================
  readonly raffleOptions = computed(() => {
    const options = [{ id: 'all', label: '📊 Todas las Rifas' }];
    
    this.filteredByDate().forEach(raffle => {
      const progress = raffle.totalTickets > 0 
        ? Math.round((raffle.soldTickets / raffle.totalTickets) * 100) 
        : 0;
      
      options.push({
        id: raffle.id,
        label: `${raffle.title} - ${progress}% vendido`
      });
    });

    return options;
  });

  // ==================== LIFECYCLE ====================
  
  ngOnInit(): void {
    this.loadTenantData();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  // ==================== DATA LOADING ====================

  private loadTenantData(): void {
    const tenantData = this.storageService.getTenant();
    if (!tenantData) {
      this.router.navigate(['/login']);
      return;
    }
    this.tenant.set(tenantData);
  }

  private async loadDashboardData(): Promise<void> {
    const tenantData = this.tenant();
    if (!tenantData) return;

    this.isLoading.set(true);

    try {
      // Cargar Rifas
      this.rafflesApi.getRaffles(tenantData.tenantId).subscribe({
        next: (raffles) => {
          console.log('✅ Rifas cargadas:', raffles);
          this.rafflesState.setRaffles(raffles);
          
          // Si hay rifas, seleccionar la primera activa
          if (raffles.length > 0) {
            const firstActive = raffles.find(r => r.status === RaffleStatus.ACTIVE);
            if (firstActive) {
              this.selectedRaffleId.set(firstActive.id);
              this.loadParticipantsForRaffle(firstActive.id);
            } else {
              this.selectedRaffleId.set(raffles[0].id);
              this.loadParticipantsForRaffle(raffles[0].id);
            }
          }

          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('❌ Error al cargar rifas:', error);
          this.isLoading.set(false);
        }
      });

    } catch (error) {
      console.error('❌ Error general al cargar dashboard:', error);
      this.isLoading.set(false);
    }
  }

  /**
   * Cargar participantes de una rifa específica
   */
  private loadParticipantsForRaffle(raffleId: string): void {
    this.participantsApi.getRaffleParticipants(raffleId).subscribe({
      next: (participants: Participant[]) => {
        console.log('✅ Participantes cargados:', participants);
        this.participantsCache.set(participants);
      },
      error: (error) => {
        console.error('❌ Error al cargar participantes:', error);
      }
    });
  }

  // ==================== ACTIONS ====================

  onRaffleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newRaffleId = select.value;
    this.selectedRaffleId.set(newRaffleId);

    // Cargar participantes de la rifa seleccionada
    if (newRaffleId !== 'all') {
      this.loadParticipantsForRaffle(newRaffleId);
    }
  }

  onDateFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.dateFilter.set(select.value as 'all' | 'week' | 'month' | 'year');
  }

  onMetricClick(metric: DashboardMetric): void {
    if (metric.isPremium && !this.isPremiumPlan()) {
      alert('Esta funcionalidad requiere un plan Premium (Emprendedor o Profesional)');
      return;
    }

    if (metric.route) {
      this.router.navigate([metric.route]);
    }
  }

  exportToExcel(): void {
    if (!this.isPremiumPlan()) {
      alert('La exportación a Excel requiere un plan Premium');
      return;
    }

    console.log('📊 Exportando dashboard a Excel...');
    alert('Generando reporte Excel... (funcionalidad en desarrollo)');
  }

  viewProjections(): void {
    if (!this.isPremiumPlan()) {
      alert('Las proyecciones detalladas requieren un plan Premium');
      return;
    }

    console.log('📈 Mostrando proyecciones...');
    alert('Vista de proyecciones en desarrollo');
  }

  upgradePlan(): void {
    alert('Próximamente: Actualización de plan');
  }

  // ==================== HELPERS ====================

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getPlanName(): string {
    return `Plan ${this.userPlan()}`;
  }

  getPlanPrice(): number {
    const prices: Record<PlanType, number> = {
      'BASICO': 0,
      'EMPRENDEDOR': 299,
      'PROFESIONAL': 599
    };
    return prices[this.userPlan()];
  }

  getStatusBadge(status: RaffleStatus): { text: string; class: string } {
    const badges: Record<RaffleStatus, { text: string; class: string }> = {
      [RaffleStatus.ACTIVE]: { text: 'Activa', class: 'active' },
      [RaffleStatus.SCHEDULED]: { text: 'Programada', class: 'scheduled' },
      [RaffleStatus.DRAFT]: { text: 'Borrador', class: 'draft' },
      [RaffleStatus.PAUSED]: { text: 'Pausada', class: 'paused' },
      [RaffleStatus.COMPLETED]: { text: 'Completada', class: 'completed' },
      [RaffleStatus.CANCELLED]: { text: 'Cancelada', class: 'cancelled' },
      [RaffleStatus.SOLD_OUT]: { text: 'Agotada', class: 'sold-out' },
      [RaffleStatus.DRAWN]: { text: 'Sorteada', class: 'drawn' }
    };
    return badges[status] || { text: status, class: 'default' };
  }
}
