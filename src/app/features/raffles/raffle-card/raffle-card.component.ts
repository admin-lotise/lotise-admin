import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Raffle, RaffleStatus } from '../../../shared/models/raffle.model';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-raffle-card',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, RouterLink],
  templateUrl: './raffle-card.component.html',
  styleUrl: './raffle-card.component.scss'
})
export class RaffleCardComponent {
  // Inputs
  raffle = input.required<Raffle>();

  // Outputs
  view = output<Raffle>();
  edit = output<Raffle>();
  delete = output<Raffle>();
  changeStatus = output<{ raffle: Raffle; status: RaffleStatus }>();

  // Estado local
  showActions = false;

  // Exponer enum para el template
  RaffleStatus = RaffleStatus;

  private readonly router = inject(Router);

  /**
   * Calcular porcentaje de venta
   */
  get salesPercentage(): number {
    const raffle = this.raffle();
    return (raffle.soldTickets / raffle.totalTickets) * 100;
  }

  /**
   * Verificar si está cerca de agotarse (>90%)
   */
  get isNearSoldOut(): boolean {
    return this.salesPercentage >= 90;
  }

  /**
   * Obtener días restantes hasta el sorteo
   */
  get daysUntilDraw(): number {
    const now = new Date();
    const drawDate = new Date(this.raffle().drawDate);
    const diffTime = drawDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Verificar si el sorteo es pronto (<7 días)
   */
  get isDrawingSoon(): boolean {
    return this.daysUntilDraw > 0 && this.daysUntilDraw <= 7;
  }

  /**
   * Obtener color del badge según estado
   */
  getStatusColor(status: RaffleStatus): string {
    const colors: Record<RaffleStatus, string> = {
      [RaffleStatus.DRAFT]: 'gray',
      [RaffleStatus.SCHEDULED]: 'blue',
      [RaffleStatus.ACTIVE]: 'green',
      [RaffleStatus.PAUSED]: 'orange',
      [RaffleStatus.SOLD_OUT]: 'purple',
      [RaffleStatus.DRAWN]: 'indigo',
      [RaffleStatus.COMPLETED]: 'teal',
      [RaffleStatus.CANCELLED]: 'red'
    };
    return colors[status] || 'gray';
  }

  /**
   * Obtener icono según estado
   */
  getStatusIcon(status: RaffleStatus): string {
    const icons: Record<RaffleStatus, string> = {
      [RaffleStatus.DRAFT]: 'fas fa-file-alt',
      [RaffleStatus.SCHEDULED]: 'fas fa-clock',
      [RaffleStatus.ACTIVE]: 'fas fa-play-circle',
      [RaffleStatus.PAUSED]: 'fas fa-pause-circle',
      [RaffleStatus.SOLD_OUT]: 'fas fa-ticket-alt',
      [RaffleStatus.DRAWN]: 'fas fa-trophy',
      [RaffleStatus.COMPLETED]: 'fas fa-check-circle',
      [RaffleStatus.CANCELLED]: 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-circle';
  }

  /**
   * Obtener texto del estado
   */
  getStatusText(status: RaffleStatus): string {
    const texts: Record<RaffleStatus, string> = {
      [RaffleStatus.DRAFT]: 'Borrador',
      [RaffleStatus.SCHEDULED]: 'Programada',
      [RaffleStatus.ACTIVE]: 'Activa',
      [RaffleStatus.PAUSED]: 'Pausada',
      [RaffleStatus.SOLD_OUT]: 'Agotada',
      [RaffleStatus.DRAWN]: 'Sorteada',
      [RaffleStatus.COMPLETED]: 'Completada',
      [RaffleStatus.CANCELLED]: 'Cancelada'
    };
    return texts[status] || status;
  }

  /**
   * Formatear moneda
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  }

  /**
   * Emitir evento de ver detalle
   */
  onView(): void {
    this.view.emit(this.raffle());
  }

  /**
   * Emitir evento de editar
   */
  onEdit(): void {
    this.edit.emit(this.raffle());
    this.closeActions();
  }

  /**
   * Emitir evento de eliminar
   */
  onDelete(): void {
    this.delete.emit(this.raffle());
    this.closeActions();
  }

  /**
   * Cambiar estado de la rifa
   */
  onChangeStatus(status: RaffleStatus): void {
    this.changeStatus.emit({ raffle: this.raffle(), status });
    this.closeActions();
  }

  /**
   * Alternar menú de acciones
   */
  toggleActions(): void {
    this.showActions = !this.showActions;
  }

  /**
   * Cerrar menú de acciones
   */
  closeActions(): void {
    this.showActions = false;
  }

  /**
   * Navegar al gestor de boletos
   */
  goToTicketManager(raffleId: string): void {
    this.router.navigate(['/raffles', raffleId, 'tickets']);
  }
}