import { Injectable, signal, computed, inject } from '@angular/core';
import { Ticket, TicketAux } from '../../shared/models/ticket.model';
import { RaffleMockDataService } from '../services/raffle-mock-data.service';

interface TicketsData {
  paid: Ticket[];
  reserved: TicketAux[];
}

@Injectable({
  providedIn: 'root'
})
export class RaffleTicketsStateService {
  private mockData = inject(RaffleMockDataService);

  // State
  private ticketsMap = signal<Map<string, TicketsData>>(new Map());
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Get all tickets (paid + reserved)
  getAllTickets(raffleId: string) {
    return computed(() => {
      const data = this.ticketsMap().get(raffleId);
      return {
        paid: data?.paid || [],
        reserved: data?.reserved || []
      };
    });
  }

  // Load tickets
  async loadTickets(raffleId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // ==================== USAR MOCK DATA ====================
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockTickets = this.mockData.getMockTickets(raffleId);
      this.ticketsMap.update(map => {
        map.set(raffleId, mockTickets);
        return new Map(map);
      });

      // TODO: Reemplazar con llamada real al API
      // const response = await firstValueFrom(this.ticketsApi.getTickets(raffleId));
      // this.ticketsMap.update(map => {
      //   map.set(raffleId, response);
      //   return new Map(map);
      // });

    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar los boletos');
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
    } else {
      this.ticketsMap.set(new Map());
    }
  }
}