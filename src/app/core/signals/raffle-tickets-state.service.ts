import { Injectable, inject, signal, computed } from '@angular/core';
import { TicketsApiService } from '../http/tickets-api.service';
import { Ticket, TicketAux } from '../../shared/models/ticket.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaffleTicketsStateService {
  private api = inject(TicketsApiService);

  // State
  private ticketsMap = signal<Map<string, Ticket[]>>(new Map());
  private reservedTicketsMap = signal<Map<string, TicketAux[]>>(new Map());
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Get all tickets (paid + reserved)
  getAllTickets(raffleId: string) {
    return computed(() => {
      const paid = this.ticketsMap().get(raffleId) || [];
      const reserved = this.reservedTicketsMap().get(raffleId) || [];
      return { paid, reserved };
    });
  }

  // Load tickets
  async loadTickets(raffleId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const [paidTickets, reservedTickets] = await Promise.all([
        firstValueFrom(this.api.getRaffleTickets(raffleId)),
        firstValueFrom(this.api.getRaffleReservedTickets(raffleId))
      ]);

      this.ticketsMap.update(map => {
        const newMap = new Map(map);
        newMap.set(raffleId, paidTickets);
        return newMap;
      });

      this.reservedTicketsMap.update(map => {
        const newMap = new Map(map);
        newMap.set(raffleId, reservedTickets);
        return newMap;
      });
    } catch (err: any) {
      this.error.set(err?.message || 'Error loading tickets');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Refresh after payment validation
  async refreshAfterPayment(raffleId: string): Promise<void> {
    await this.loadTickets(raffleId);
  }

  // Clear cache
  clearCache(raffleId?: string): void {
    if (raffleId) {
      this.ticketsMap.update(map => {
        const newMap = new Map(map);
        newMap.delete(raffleId);
        return newMap;
      });
      this.reservedTicketsMap.update(map => {
        const newMap = new Map(map);
        newMap.delete(raffleId);
        return newMap;
      });
    } else {
      this.ticketsMap.set(new Map());
      this.reservedTicketsMap.set(new Map());
    }
  }
}