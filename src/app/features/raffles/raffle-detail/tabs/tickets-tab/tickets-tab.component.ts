import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleTicketsStateService } from '../../../../../core/signals/raffle-tickets-state.service';
import { Ticket, TicketAux } from '../../../../../shared/models/ticket.model';

type TicketView = {
  number: string;
  status: 'available' | 'reserved' | 'paid';
  buyerName?: string;
  buyerPhone?: string;
  paidAt?: string;
  reservedAt?: string;
  opportunities?: string[];
};

@Component({
  selector: 'app-tickets-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets-tab.component.html',
  styleUrl: './tickets-tab.component.scss'
})
export class TicketsTabComponent implements OnInit {
  @Input({ required: true }) raffleId!: string;
  @Input() totalTickets: number = 100; // Default, se puede pasar desde el padre

  // Services
  private ticketsState = inject(RaffleTicketsStateService);

  // State
  ticketsData = computed(() => this.ticketsState.getAllTickets(this.raffleId)());
  isLoading = this.ticketsState.isLoading;
  error = this.ticketsState.error;

  // Filters
  statusFilter = signal<'all' | 'available' | 'reserved' | 'paid'>('all');
  searchTerm = signal<string>('');
  viewMode = signal<'grid' | 'list'>('grid');

  // Selected ticket for detail
  selectedTicket = signal<TicketView | null>(null);
  showDetailModal = signal(false);

  // All tickets merged (paid + reserved + available)
  allTickets = computed(() => {
    const data = this.ticketsData();
    const paidTickets = data.paid || [];
    const reservedTickets = data.reserved || [];
    
    // Create map of all tickets
    const ticketsMap = new Map<string, TicketView>();

    // Add paid tickets
    paidTickets.forEach(ticket => {
      ticketsMap.set(ticket.number, {
        number: ticket.number,
        status: 'paid',
        buyerName: ticket.buyerFirstName && ticket.buyerLastName 
          ? `${ticket.buyerFirstName} ${ticket.buyerLastName}`
          : undefined,
        buyerPhone: ticket.buyerPhone,
        paidAt: ticket.paidAt,
        opportunities: ticket.opportunities
      });
    });

    // Add reserved tickets
    reservedTickets.forEach(ticket => {
      if (!ticketsMap.has(ticket.number)) {
        ticketsMap.set(ticket.number, {
          number: ticket.number,
          status: 'reserved',
          buyerName: `${ticket.buyerFirstName} ${ticket.buyerLastName}`,
          buyerPhone: ticket.buyerPhone,
          reservedAt: ticket.reservedAt,
          opportunities: ticket.opportunities
        });
      }
    });

    // Fill available tickets
    for (let i = 1; i <= this.totalTickets; i++) {
      const number = i.toString().padStart(3, '0');
      if (!ticketsMap.has(number)) {
        ticketsMap.set(number, {
          number,
          status: 'available'
        });
      }
    }

    return Array.from(ticketsMap.values()).sort((a, b) => 
      parseInt(a.number) - parseInt(b.number)
    );
  });

  // Stats
  stats = computed(() => {
    const tickets = this.allTickets();
    return {
      total: tickets.length,
      available: tickets.filter(t => t.status === 'available').length,
      reserved: tickets.filter(t => t.status === 'reserved').length,
      paid: tickets.filter(t => t.status === 'paid').length,
      percentage: tickets.length > 0 
        ? Math.round((tickets.filter(t => t.status === 'paid').length / tickets.length) * 100)
        : 0
    };
  });

  // Filtered tickets
  filteredTickets = computed(() => {
    let filtered = this.allTickets();

    // Status filter
    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter(t => t.status === this.statusFilter());
    }

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(t =>
        t.number.includes(search) ||
        t.buyerName?.toLowerCase().includes(search) ||
        t.buyerPhone?.includes(search)
      );
    }

    return filtered;
  });

  async ngOnInit(): Promise<void> {
    await this.loadTickets();
  }

  async loadTickets(): Promise<void> {
    try {
      await this.ticketsState.loadTickets(this.raffleId);
    } catch (err) {
      console.error('Error loading tickets:', err);
    }
  }

  // Actions
  viewTicketDetail(ticket: TicketView): void {
    this.selectedTicket.set(ticket);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedTicket.set(null);
  }

  // Helpers
  getStatusClass(status: string): string {
    return `ticket-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      available: 'Disponible',
      reserved: 'Reservado',
      paid: 'Pagado'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      available: 'fa-circle',
      reserved: 'fa-clock',
      paid: 'fa-check-circle'
    };
    return icons[status] || 'fa-circle';
  }
}