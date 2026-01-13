import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleEventsStateService } from '../../../../../core/signals/raffle-events-state.service';
import { RaffleEvent } from '../../../../../shared/models/ticket.model';

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-tab.component.html',
  styleUrl: './history-tab.component.scss'
})
export class HistoryTabComponent implements OnInit {
  @Input({ required: true }) raffleId!: string;

  // Services
  private eventsState = inject(RaffleEventsStateService);

  // State
  events = computed(() => this.eventsState.getEvents(this.raffleId)());
  stats = computed(() => this.eventsState.getEventsStats(this.raffleId)());
  isLoading = this.eventsState.isLoading;
  error = this.eventsState.error;

  // Filters
  eventTypeFilter = signal<string>('all');
  searchTerm = signal<string>('');

  // Filtered events
  filteredEvents = computed(() => {
    let filtered = this.events();

    // Type filter
    if (this.eventTypeFilter() !== 'all') {
      filtered = filtered.filter(e => e.eventType === this.eventTypeFilter());
    }

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(e =>
        e.eventType.toLowerCase().includes(search) ||
        e.description?.toLowerCase().includes(search) ||
        e.performedBy?.toLowerCase().includes(search)
      );
    }

    // Sort by timestamp DESC
    return filtered.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });

  // Grouped events by date
  groupedEvents = computed(() => {
    const events = this.filteredEvents();
    const groups = new Map<string, RaffleEvent[]>();

    events.forEach(event => {
      const date = new Date(event.timestamp).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(event);
    });

    return Array.from(groups.entries()).map(([date, items]) => ({
      date,
      events: items
    }));
  });

  async ngOnInit(): Promise<void> {
    await this.loadEvents();
  }

  async loadEvents(): Promise<void> {
    try {
      await this.eventsState.loadEvents(this.raffleId);
    } catch (err) {
      console.error('Error loading events:', err);
    }
  }

  // Helpers
  getEventIcon(eventType: string): string {
    const icons: Record<string, string> = {
      'raffle_created': 'fa-plus-circle',
      'raffle_updated': 'fa-edit',
      'raffle_published': 'fa-globe',
      'raffle_closed': 'fa-lock',
      'tickets_reserved': 'fa-clock',
      'payment_created': 'fa-dollar-sign',
      'payment_validated': 'fa-check-circle',
      'payment_rejected': 'fa-times-circle',
      'winner_selected': 'fa-trophy',
      'prize_delivered': 'fa-gift'
    };
    return icons[eventType] || 'fa-circle';
  }

  getEventColor(eventType: string): string {
    const colors: Record<string, string> = {
      'raffle_created': 'color-info',
      'raffle_updated': 'color-primary',
      'raffle_published': 'color-success',
      'raffle_closed': 'color-danger',
      'tickets_reserved': 'color-warning',
      'payment_created': 'color-info',
      'payment_validated': 'color-success',
      'payment_rejected': 'color-danger',
      'winner_selected': 'color-winner',
      'prize_delivered': 'color-success'
    };
    return colors[eventType] || 'color-default';
  }

  getEventLabel(eventType: string): string {
    const labels: Record<string, string> = {
      'raffle_created': 'Rifa Creada',
      'raffle_updated': 'Rifa Actualizada',
      'raffle_published': 'Rifa Publicada',
      'raffle_closed': 'Rifa Cerrada',
      'tickets_reserved': 'Boletos Reservados',
      'payment_created': 'Pago Creado',
      'payment_validated': 'Pago Validado',
      'payment_rejected': 'Pago Rechazado',
      'winner_selected': 'Ganador Seleccionado',
      'prize_delivered': 'Premio Entregado'
    };
    return labels[eventType] || eventType;
  }

  exportHistory(): void {
    console.log('Exportar historial');
    // TODO: Implement export functionality
  }
}