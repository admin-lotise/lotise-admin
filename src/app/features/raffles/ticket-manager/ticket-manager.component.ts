import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { RafflesApiService } from '../../../core/http/raffles-api.service';
import { Raffle } from '../../../shared/models/raffle.model';

// Modelos para boletos
export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  CANCELLED = 'CANCELLED'
}

export interface Ticket {
  id: string;
  raffleId: string;
  ticketNumber: number;
  status: TicketStatus;
  buyerId?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  purchaseDate?: Date;
  reservationExpiry?: Date;
  paymentStatus?: 'PENDING' | 'PAID';
  amount?: number;
}

@Component({
  selector: 'app-ticket-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-manager.component.html',
  styleUrl: './ticket-manager.component.scss'
})
export class TicketManagerComponent implements OnInit {
  // Signals
  raffleId = signal<string | null>(null);
  raffle = signal<Raffle | null>(null);
  tickets = signal<Ticket[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Filtros y búsqueda
  searchQuery = signal('');
  selectedStatus = signal<TicketStatus | 'ALL'>('ALL');
  
  // Modal de asignación
  showAssignModal = signal(false);
  assignForm!: FormGroup;
  selectedTickets = signal<number[]>([]);

  // Enums
  TicketStatus = TicketStatus;

  // Computed
  filteredTickets = computed(() => {
    let filtered = this.tickets();
    
    // Filtrar por estado
    const status = this.selectedStatus();
    if (status !== 'ALL') {
      filtered = filtered.filter(t => t.status === status);
    }

    // Filtrar por búsqueda
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(t => 
        t.ticketNumber.toString().includes(query) ||
        t.buyerName?.toLowerCase().includes(query) ||
        t.buyerEmail?.toLowerCase().includes(query) ||
        t.buyerPhone?.includes(query)
      );
    }

    return filtered.sort((a, b) => a.ticketNumber - b.ticketNumber);
  });

  stats = computed(() => {
    const tickets = this.tickets();
    return {
      total: tickets.length,
      available: tickets.filter(t => t.status === TicketStatus.AVAILABLE).length,
      reserved: tickets.filter(t => t.status === TicketStatus.RESERVED).length,
      sold: tickets.filter(t => t.status === TicketStatus.SOLD).length,
      cancelled: tickets.filter(t => t.status === TicketStatus.CANCELLED).length
    };
  });

  constructor(
    private route: ActivatedRoute,
    private rafflesApi: RafflesApiService,
    private fb: FormBuilder
  ) {
    this.initAssignForm();
  }

  async ngOnInit(): Promise<void> {
    this.raffleId.set(this.route.snapshot.paramMap.get('id'));
    
    if (this.raffleId()) {
      await this.loadRaffle();
      await this.loadTickets();
    }
  }

  private initAssignForm(): void {
    this.assignForm = this.fb.group({
      ticketNumbers: ['', Validators.required],
      buyerName: ['', [Validators.required, Validators.minLength(3)]],
      buyerEmail: ['', [Validators.required, Validators.email]],
      buyerPhone: ['', Validators.required],
      paymentStatus: ['PENDING', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Cargar información de la rifa
   */
  private async loadRaffle(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const tenantId = 'tenant-demo';
      const raffle = await firstValueFrom(
        this.rafflesApi.getRaffle(tenantId, this.raffleId()!)
      );

      this.raffle.set(raffle);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar la rifa');
      console.error('Error loading raffle:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cargar boletos de la rifa
   */
  private async loadTickets(): Promise<void> {
    try {
      this.isLoading.set(true);
      
      // TODO: Implementar API real
      // const tickets = await this.ticketsApi.getTickets(raffleId);
      
      // Mock data
      const raffle = this.raffle();
      if (!raffle) return;

      const mockTickets: Ticket[] = [];
      
      for (let i = 1; i <= raffle.totalTickets; i++) {
        const isSold = i <= raffle.soldTickets;
        const isReserved = !isSold && i <= (raffle.soldTickets + raffle.reservedTickets);
        
        mockTickets.push({
          id: `ticket-${i}`,
          raffleId: raffle.id,
          ticketNumber: i,
          status: isSold ? TicketStatus.SOLD : 
                  isReserved ? TicketStatus.RESERVED : 
                  TicketStatus.AVAILABLE,
          buyerName: isSold ? `Comprador ${i}` : undefined,
          buyerEmail: isSold ? `comprador${i}@example.com` : undefined,
          buyerPhone: isSold ? `555-000${String(i).padStart(4, '0')}` : undefined,
          purchaseDate: isSold ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
          paymentStatus: isSold ? (Math.random() > 0.2 ? 'PAID' : 'PENDING') : undefined,
          amount: isSold ? raffle.baseTicketPrice : undefined,
          reservationExpiry: isReserved ? new Date(Date.now() + 15 * 60 * 1000) : undefined
        });
      }

      this.tickets.set(mockTickets);
    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar boletos');
      console.error('Error loading tickets:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Filtrar por estado
   */
  filterByStatus(status: TicketStatus | 'ALL'): void {
    this.selectedStatus.set(status);
  }

  /**
   * Buscar boletos
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  /**
   * Abrir modal de asignación
   */
  openAssignModal(): void {
    this.showAssignModal.set(true);
    this.assignForm.reset({
      paymentStatus: 'PENDING',
      amount: this.raffle()?.baseTicketPrice || 0
    });
  }

  /**
   * Cerrar modal
   */
  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.assignForm.reset();
  }

  /**
   * Asignar boletos a un comprador
   */
  async assignTickets(): Promise<void> {
    if (!this.assignForm.valid) {
      return;
    }

    try {
      const formValue = this.assignForm.value;
      
      // Parsear números de boletos
      const ticketNumbers = formValue.ticketNumbers
        .split(',')
        .map((n: string) => parseInt(n.trim()))
        .filter((n: number) => !isNaN(n));

      console.log('Asignando boletos:', ticketNumbers);
      console.log('Comprador:', formValue.buyerName);

      // TODO: Implementar API real
      // await this.ticketsApi.assignTickets(raffleId, ticketNumbers, buyerData);

      // Mock: Actualizar tickets localmente
      this.tickets.update(tickets => 
        tickets.map(t => {
          if (ticketNumbers.includes(t.ticketNumber)) {
            return {
              ...t,
              status: TicketStatus.SOLD,
              buyerName: formValue.buyerName,
              buyerEmail: formValue.buyerEmail,
              buyerPhone: formValue.buyerPhone,
              paymentStatus: formValue.paymentStatus,
              amount: formValue.amount,
              purchaseDate: new Date()
            };
          }
          return t;
        })
      );

      this.closeAssignModal();
      alert(`${ticketNumbers.length} boleto(s) asignado(s) correctamente`);
    } catch (err: any) {
      alert(err?.message || 'Error al asignar boletos');
      console.error('Error assigning tickets:', err);
    }
  }

  /**
   * Liberar boleto (cancelar venta)
   */
  async releaseTicket(ticket: Ticket): Promise<void> {
    if (!confirm(`¿Liberar el boleto #${ticket.ticketNumber}?`)) {
      return;
    }

    try {
      // TODO: API real
      // await this.ticketsApi.releaseTicket(ticket.id);

      this.tickets.update(tickets =>
        tickets.map(t => 
          t.id === ticket.id 
            ? { ...t, status: TicketStatus.AVAILABLE, buyerId: undefined, buyerName: undefined }
            : t
        )
      );

      alert('Boleto liberado correctamente');
    } catch (err: any) {
      alert(err?.message || 'Error al liberar boleto');
    }
  }

  /**
   * Marcar como pagado
   */
  async markAsPaid(ticket: Ticket): Promise<void> {
    try {
      // TODO: API real
      this.tickets.update(tickets =>
        tickets.map(t => 
          t.id === ticket.id ? { ...t, paymentStatus: 'PAID' as const } : t
        )
      );

      alert('Boleto marcado como pagado');
    } catch (err: any) {
      alert(err?.message || 'Error al actualizar estado de pago');
    }
  }

  /**
   * Obtener clase CSS según estado
   */
  getStatusClass(status: TicketStatus): string {
    const classes: Record<TicketStatus, string> = {
      [TicketStatus.AVAILABLE]: 'status-available',
      [TicketStatus.RESERVED]: 'status-reserved',
      [TicketStatus.SOLD]: 'status-sold',
      [TicketStatus.CANCELLED]: 'status-cancelled'
    };
    return classes[status];
  }

  /**
   * Obtener etiqueta de estado
   */
  getStatusLabel(status: TicketStatus): string {
    const labels: Record<TicketStatus, string> = {
      [TicketStatus.AVAILABLE]: 'Disponible',
      [TicketStatus.RESERVED]: 'Reservado',
      [TicketStatus.SOLD]: 'Vendido',
      [TicketStatus.CANCELLED]: 'Cancelado'
    };
    return labels[status];
  }
}