import { Injectable, signal, computed, inject } from '@angular/core';
import { RaffleEvent } from '../../shared/models/ticket.model';
import { RaffleMockDataService } from '../services/raffle-mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RaffleEventsStateService {
  private mockData = inject(RaffleMockDataService);

  // State
  private eventsMap = signal<Map<string, RaffleEvent[]>>(new Map());
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Get events for specific raffle
  getEvents(raffleId: string) {
    return computed(() => this.eventsMap().get(raffleId) || []);
  }

  // Get events stats
  getEventsStats(raffleId: string) {
    return computed(() => {
      const events = this.eventsMap().get(raffleId) || [];
      return {
        total: events.length,
        reservations: events.filter(e => e.eventType === 'tickets_reserved').length,
        payments: events.filter(e => 
          e.eventType === 'payment_created' || 
          e.eventType === 'payment_validated' || 
          e.eventType === 'payment_rejected'
        ).length,
        updates: events.filter(e => e.eventType === 'raffle_updated').length
      };
    });
  }

  // Load events
  async loadEvents(raffleId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // ==================== USAR MOCK DATA ====================
      await new Promise(resolve => setTimeout(resolve, 700));
      const mockEvents = this.mockData.getMockEvents(raffleId);
      this.eventsMap.update(map => {
        map.set(raffleId, mockEvents);
        return new Map(map);
      });

      // TODO: Reemplazar con llamada real al API
      // const response = await firstValueFrom(this.eventsApi.getEvents(raffleId));
      // this.eventsMap.update(map => {
      //   map.set(raffleId, response);
      //   return new Map(map);
      // });

    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar el historial');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Load events by type (mock implementation)
  async loadEventsByType(raffleId: string, eventType: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // TODO: Implementar llamada al API real
      // const events = await firstValueFrom(
      //   this.api.getRaffleEventsByType(raffleId, eventType)
      // );
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const allEvents = this.mockData.getMockEvents(raffleId);
      const filteredEvents = allEvents.filter(e => e.eventType === eventType);
      
      this.eventsMap.update(map => {
        map.set(raffleId, filteredEvents);
        return new Map(map);
      });

    } catch (err: any) {
      this.error.set(err?.message || 'Error loading events');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Clear cache
  clearCache(raffleId?: string): void {
    if (raffleId) {
      this.eventsMap.update(map => {
        const newMap = new Map(map);
        newMap.delete(raffleId);
        return newMap;
      });
    } else {
      this.eventsMap.set(new Map());
    }
  }
}