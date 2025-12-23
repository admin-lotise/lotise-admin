import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { RaffleCardComponent } from './raffle-card/raffle-card.component';
import { Raffle, RaffleStatus, RaffleFilters } from '../../shared/models/raffle.model';
import { RafflesApiService } from '../../core/http/raffles-api.service';
import { RafflesStateService } from '../../core/signals/raffles-state.service';
import { ConfirmDialogComponent } from '../../shared/components/ui/modal/confirm-dialog.component';

@Component({
  selector: 'app-raffles',
  standalone: true,
  imports: [
    CommonModule,
    RaffleCardComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './raffles.component.html',
  styleUrl: './raffles.component.scss'
})
export class RafflesComponent implements OnInit {
  // Signals
  isLoading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal('');
  selectedStatus = signal<RaffleStatus[]>([]);
  showDeleteConfirm = signal(false);
  raffleToDelete = signal<Raffle | null>(null);

  // Exponer enums para el template
  RaffleStatus = RaffleStatus;

  // Computed signals
  filteredRaffles = computed(() => {
    let raffles = this.rafflesState.raffles();
    
    // Filtrar por búsqueda
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      raffles = raffles.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.prizes.some(p => p.name.toLowerCase().includes(query))
      );
    }

    // Filtrar por estado
    const statuses = this.selectedStatus();
    if (statuses.length > 0) {
      raffles = raffles.filter(r => statuses.includes(r.status));
    }

    return raffles;
  });

  hasRaffles = computed(() => this.rafflesState.hasRaffles());
  hasFilters = computed(() => this.searchQuery().length > 0 || this.selectedStatus().length > 0);

  constructor(
    private router: Router,
    private rafflesApi: RafflesApiService,
    public rafflesState: RafflesStateService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadRaffles();
    await this.loadStats();
  }

  /**
   * Cargar rifas
   */
  async loadRaffles(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const tenantId = 'tenant-demo'; // TODO: Obtener desde AuthStateService
      
      const raffles = await firstValueFrom(
        this.rafflesApi.getRaffles(tenantId)
      );

      this.rafflesState.setRaffles(raffles);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar rifas');
      console.error('Error loading raffles:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cargar estadísticas
   */
  async loadStats(): Promise<void> {
    try {
      const tenantId = 'tenant-demo';
      
      const stats = await firstValueFrom(
        this.rafflesApi.getStats(tenantId)
      );

      this.rafflesState.setStats(stats);
    } catch (err: any) {
      console.error('Error loading stats:', err);
    }
  }

  /**
   * Buscar rifas
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  /**
   * Filtrar por estado
   */
  toggleStatusFilter(status: RaffleStatus): void {
    const current = this.selectedStatus();
    
    if (current.includes(status)) {
      this.selectedStatus.set(current.filter(s => s !== status));
    } else {
      this.selectedStatus.set([...current, status]);
    }
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedStatus.set([]);
  }

  /**
   * Ver detalle de rifa
   */
  onViewRaffle(raffle: Raffle): void {
    this.router.navigate(['/raffles', raffle.id]);
  }

  /**
   * Crear nueva rifa
   */
  onCreateRaffle(): void {
    this.router.navigate(['/raffles/new']);
  }

  /**
   * Editar rifa
   */
  onEditRaffle(raffle: Raffle): void {
    this.router.navigate(['/raffles', raffle.id, 'edit']);
  }

  /**
   * Abrir confirmación de eliminación
   */
  onDeleteRaffle(raffle: Raffle): void {
    this.raffleToDelete.set(raffle);
    this.showDeleteConfirm.set(true);
  }

  /**
   * Confirmar eliminación
   */
  async confirmDelete(): Promise<void> {
    const raffle = this.raffleToDelete();
    if (!raffle) return;

    try {
      this.isLoading.set(true);
      const tenantId = 'tenant-demo';

      await firstValueFrom(
        this.rafflesApi.deleteRaffle(tenantId, raffle.id)
      );

      this.rafflesState.deleteRaffle(raffle.id);
      this.showDeleteConfirm.set(false);
      this.raffleToDelete.set(null);

      // TODO: Mostrar toast de éxito
    } catch (err: any) {
      this.error.set(err?.message || 'Error al eliminar rifa');
      console.error('Error deleting raffle:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cancelar eliminación
   */
  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.raffleToDelete.set(null);
  }

  /**
   * Cambiar estado de rifa
   */
  async onChangeStatus(event: { raffle: Raffle; status: RaffleStatus }): Promise<void> {
    const { raffle, status } = event;

    try {
      this.isLoading.set(true);
      const tenantId = 'tenant-demo';

      await firstValueFrom(
        this.rafflesApi.updateRaffle(tenantId, raffle.id, { status })
      );

      this.rafflesState.updateRaffleStatus(raffle.id, status);

      // TODO: Mostrar toast de éxito
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cambiar estado');
      console.error('Error changing status:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener label del filtro de estado
   */
  getStatusFilterLabel(status: RaffleStatus): string {
    const labels: Record<RaffleStatus, string> = {
      [RaffleStatus.DRAFT]: 'Borradores',
      [RaffleStatus.SCHEDULED]: 'Programadas',
      [RaffleStatus.ACTIVE]: 'Activas',
      [RaffleStatus.PAUSED]: 'Pausadas',
      [RaffleStatus.SOLD_OUT]: 'Agotadas',
      [RaffleStatus.DRAWN]: 'Sorteadas',
      [RaffleStatus.COMPLETED]: 'Completadas',
      [RaffleStatus.CANCELLED]: 'Canceladas'
    };
    return labels[status] || status;
  }

  /**
   * Verificar si un filtro está activo
   */
  isStatusFilterActive(status: RaffleStatus): boolean {
    return this.selectedStatus().includes(status);
  }
}