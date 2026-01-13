import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleParticipantsStateService } from '../../../../../core/signals/raffle-participants-state.service';
import { Participant } from '../../../../../shared/models/ticket.model';

@Component({
  selector: 'app-participants-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participants-tab.component.html',
  styleUrl: './participants-tab.component.scss'
})
export class ParticipantsTabComponent implements OnInit {
  @Input({ required: true }) raffleId!: string;

  // Services
  private participantsState = inject(RaffleParticipantsStateService);

  // State
  participants = computed(() => this.participantsState.getParticipants(this.raffleId)());
  isLoading = this.participantsState.isLoading;
  error = this.participantsState.error;

  // Filters & sorting
  searchTerm = signal<string>('');
  sortBy = signal<'name' | 'tickets' | 'amount' | 'date'>('date');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // Selected participant for detail view
  selectedParticipant = signal<Participant | null>(null);
  showDetailModal = signal(false);

  // Stats computadas
  stats = computed(() => {
    const parts = this.participants();
    return {
      total: parts.length,
      totalTickets: parts.reduce((sum, p) => sum + p.totalTickets, 0),
      totalPaid: parts.reduce((sum, p) => sum + p.totalPaid, 0),
      withPayments: parts.filter(p => p.paidTickets > 0).length
    };
  });

  // Filtered and sorted participants
  filteredParticipants = computed(() => {
    let filtered = this.participants();

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.buyerFirstName.toLowerCase().includes(search) ||
        p.buyerLastName.toLowerCase().includes(search) ||
        p.buyerPhone.includes(search) ||
        p.buyerEmail?.toLowerCase().includes(search)
      );
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      const order = this.sortOrder() === 'asc' ? 1 : -1;

      switch (this.sortBy()) {
        case 'name':
          return order * `${a.buyerFirstName} ${a.buyerLastName}`.localeCompare(`${b.buyerFirstName} ${b.buyerLastName}`);
        case 'tickets':
          return order * (a.totalTickets - b.totalTickets);
        case 'amount':
          return order * (a.totalPaid - b.totalPaid);
        case 'date':
          return order * (new Date(a.firstPurchase).getTime() - new Date(b.firstPurchase).getTime());
        default:
          return 0;
      }
    });

    return sorted;
  });

  async ngOnInit(): Promise<void> {
    await this.loadParticipants();
  }

  async loadParticipants(): Promise<void> {
    try {
      await this.participantsState.loadParticipants(this.raffleId);
    } catch (err) {
      console.error('Error loading participants:', err);
    }
  }

  // Actions
  viewParticipantDetail(participant: Participant): void {
    this.selectedParticipant.set(participant);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedParticipant.set(null);
  }

  setSorting(column: 'name' | 'tickets' | 'amount' | 'date'): void {
    if (this.sortBy() === column) {
      // Toggle order
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default desc
      this.sortBy.set(column);
      this.sortOrder.set('desc');
    }
  }

  exportParticipants(): void {
    console.log('Exportar participantes');
    // TODO: Implement export functionality
  }

  // Helpers
  getParticipantStatus(participant: Participant): string {
    if (participant.paidTickets === participant.totalTickets) {
      return 'Pagado completo';
    } else if (participant.paidTickets > 0) {
      return 'Pago parcial';
    } else {
      return 'Pendiente';
    }
  }

  getStatusClass(participant: Participant): string {
    if (participant.paidTickets === participant.totalTickets) {
      return 'status-paid';
    } else if (participant.paidTickets > 0) {
      return 'status-partial';
    } else {
      return 'status-pending';
    }
  }
}