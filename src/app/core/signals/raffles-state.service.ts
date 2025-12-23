import { Injectable, signal, computed } from '@angular/core';
import { Raffle, RaffleStatus, RaffleStats } from '../../shared/models/raffle.model';

@Injectable({
  providedIn: 'root'
})
export class RafflesStateService {
  // Signal privado para la lista de rifas
  private readonly _raffles = signal<Raffle[]>([]);

  // Signal privado para estadísticas
  private readonly _stats = signal<RaffleStats | null>(null);

  // Signals públicos (readonly)
  readonly raffles = this._raffles.asReadonly();
  readonly stats = this._stats.asReadonly();

  // ==================== COMPUTED SIGNALS ====================

  /**
   * Rifas activas (vendiendo actualmente)
   */
  readonly activeRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.ACTIVE)
  );

  /**
   * Rifas programadas (próximas a iniciar)
   */
  readonly scheduledRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.SCHEDULED)
  );

  /**
   * Rifas en borrador
   */
  readonly draftRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.DRAFT)
  );

  /**
   * Rifas completadas
   */
  readonly completedRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.COMPLETED)
  );

  /**
   * Rifas canceladas
   */
  readonly cancelledRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.CANCELLED)
  );

  /**
   * Rifas pausadas
   */
  readonly pausedRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.PAUSED)
  );

  /**
   * Rifas agotadas (todos los boletos vendidos)
   */
  readonly soldOutRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.SOLD_OUT)
  );

  /**
   * Rifas sorteadas (esperando entrega de premio)
   */
  readonly drawnRaffles = computed(() => 
    this._raffles().filter(r => r.status === RaffleStatus.DRAWN)
  );

  /**
   * Total de rifas
   */
  readonly totalRaffles = computed(() => this._raffles().length);

  /**
   * Verificar si hay rifas
   */
  readonly hasRaffles = computed(() => this._raffles().length > 0);

  /**
   * Verificar si hay rifas activas
   */
  readonly hasActiveRaffles = computed(() => this.activeRaffles().length > 0);

  /**
   * Ingresos totales proyectados (todos los boletos vendidos)
   */
  readonly totalRevenue = computed(() => 
    this._raffles().reduce((sum, r) => sum + (r.soldTickets * r.baseTicketPrice), 0)
  );

  /**
   * Total de boletos vendidos
   */
  readonly totalTicketsSold = computed(() => 
    this._raffles().reduce((sum, r) => sum + r.soldTickets, 0)
  );

  /**
   * Rifas ordenadas por fecha de sorteo (próximas primero)
   */
  readonly rafflesByDrawDate = computed(() => 
    [...this._raffles()].sort((a, b) => 
      new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime()
    )
  );

  /**
   * Rifas ordenadas por fecha de creación (más recientes primero)
   */
  readonly rafflesByCreatedDate = computed(() => 
    [...this._raffles()].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  /**
   * Rifas ordenadas por popularidad (más vendidas primero)
   */
  readonly rafflesByPopularity = computed(() => 
    [...this._raffles()].sort((a, b) => b.soldTickets - a.soldTickets)
  );

  /**
   * Porcentaje promedio de boletos vendidos
   */
  readonly averageSoldPercentage = computed(() => {
    const raffles = this._raffles();
    if (raffles.length === 0) return 0;
    
    const totalPercentage = raffles.reduce((sum, r) => {
      return sum + (r.soldTickets / r.totalTickets) * 100;
    }, 0);
    
    return totalPercentage / raffles.length;
  });

  // ==================== MÉTODOS PÚBLICOS ====================

  /**
   * Establecer lista completa de rifas
   */
  setRaffles(raffles: Raffle[]): void {
    this._raffles.set(raffles);
  }

  /**
   * Establecer estadísticas
   */
  setStats(stats: RaffleStats): void {
    this._stats.set(stats);
  }

  /**
   * Agregar nueva rifa
   */
  addRaffle(raffle: Raffle): void {
    this._raffles.update(raffles => [...raffles, raffle]);
  }

  /**
   * Actualizar rifa existente
   */
  updateRaffle(id: string, updates: Partial<Raffle> | Raffle): void {
    this._raffles.update((raffles: Raffle[]) =>
      raffles.map((raffle: Raffle) => {
        if (raffle.id !== id) {
          return raffle;
        }

        // Crear nuevo objeto con spread para forzar nueva referencia
        const updated: Raffle = {
          ...raffle,
          ...updates,
          updatedAt: new Date()
        };

        return updated;
      })
    );
  }

  /**
   * Eliminar rifa
   */
  deleteRaffle(id: string): void {
    this._raffles.update(raffles => raffles.filter(r => r.id !== id));
  }

  /**
   * Buscar rifa por ID
   */
  getRaffleById(id: string): Raffle | undefined {
    return this._raffles().find(r => r.id === id);
  }

  /**
   * Actualizar estado de una rifa
   */
  updateRaffleStatus(id: string, status: RaffleStatus): void {
    this.updateRaffle(id, { status });
  }

  /**
   * Actualizar tickets vendidos
   */
  updateTicketsSold(id: string, soldTickets: number): void {
    const raffle = this.getRaffleById(id);
    if (!raffle) return;

    const availableTickets = raffle.totalTickets - soldTickets - raffle.reservedTickets;
    
    this.updateRaffle(id, {
      soldTickets,
      availableTickets,
      // Auto-cambiar a SOLD_OUT si se vendieron todos
      status: availableTickets === 0 ? RaffleStatus.SOLD_OUT : raffle.status
    });
  }

  /**
   * Actualizar tickets reservados
   */
  updateTicketsReserved(id: string, reservedTickets: number): void {
    const raffle = this.getRaffleById(id);
    if (!raffle) return;

    const availableTickets = raffle.totalTickets - raffle.soldTickets - reservedTickets;
    
    this.updateRaffle(id, {
      reservedTickets,
      availableTickets
    });
  }

  /**
   * Filtrar rifas por estado
   */
  filterByStatus(statuses: RaffleStatus[]): Raffle[] {
    return this._raffles().filter(r => statuses.includes(r.status));
  }

  /**
   * Buscar rifas por texto
   */
  search(query: string): Raffle[] {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      return this._raffles();
    }

    return this._raffles().filter(r => 
      r.title.toLowerCase().includes(searchTerm) ||
      r.description.toLowerCase().includes(searchTerm) ||
      r.prizes.some(p => p.name.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * ✅ CORREGIDO: Validar endDate antes de crear Date
   */
  getEndingSoon(): Raffle[] {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this._raffles().filter(r => {
      if (!r.endDate) return false; // ✅ Validación agregada
      
      const endDate = new Date(r.endDate);
      return r.status === RaffleStatus.ACTIVE && 
             endDate > now && 
             endDate <= sevenDaysLater;
    });
  }

  /**
   * Obtener rifas que se sortean pronto (próximos 7 días)
   */
  getDrawingSoon(): Raffle[] {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this._raffles().filter(r => {
      const drawDate = new Date(r.drawDate);
      return (r.status === RaffleStatus.ACTIVE || r.status === RaffleStatus.SOLD_OUT) && 
             drawDate > now && 
             drawDate <= sevenDaysLater;
    });
  }

  /**
   * Calcular progreso de venta (0-100)
   */
  getSalesProgress(raffleId: string): number {
    const raffle = this.getRaffleById(raffleId);
    if (!raffle) return 0;
    
    return (raffle.soldTickets / raffle.totalTickets) * 100;
  }

  /**
   * Verificar si una rifa está cerca de agotarse (>90% vendido)
   */
  isNearSoldOut(raffleId: string): boolean {
    return this.getSalesProgress(raffleId) >= 90;
  }

  /**
   * Calcular tiempo restante hasta el sorteo (en días)
   */
  getDaysUntilDraw(raffleId: string): number {
    const raffle = this.getRaffleById(raffleId);
    if (!raffle) return 0;

    const now = new Date();
    const drawDate = new Date(raffle.drawDate);
    const diffTime = drawDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._raffles.set([]);
    this._stats.set(null);
  }
}