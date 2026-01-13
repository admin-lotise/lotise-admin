import { Injectable, inject, signal, computed } from '@angular/core';
import { RaffleEventsApiService } from '../http/raffle-events-api.service';
import { RaffleEvent } from '../../shared/models/ticket.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaffleEventsStateService {
  private api = inject(RaffleEventsApiService);

  // State
  private eventsMap = signal<Map<string, RaffleEvent[]>>(new Map());
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Get events for specific raffle
  getEvents(raffleId: string) {
    return computed(() => this.eventsMap().get(raffleId) || []);
  }

  // Get events filtered by type
  getEventsByType(raffleId: string, eventType: string) {
    return computed(() => {
      const events = this.eventsMap().get(raffleId) || [];
      return events.filter(e => e.eventType === eventType);
    });
  }

  // Get events stats
  getEventsStats(raffleId: string) {
    return computed(() => {
      const events = this.eventsMap().get(raffleId) || [];
      return {
        total: events.length,
        reservations: events.filter(e => e.eventType === 'tickets_reserved').length,
        payments: events.filter(e => e.eventType === 'payment_validated').length,
        updates: events.filter(e => e.eventType === 'raffle_updated').length
      };
    });
  }

  // Load events
  async loadEvents(raffleId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const events = await firstValueFrom(
        this.api.getRaffleEvents(raffleId)
      );

      this.eventsMap.update(map => {
        const newMap = new Map(map);
        newMap.set(raffleId, events);
        return newMap;
      });
    } catch (err: any) {
      this.error.set(err?.message || 'Error loading events');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Load events by type
  async loadEventsByType(raffleId: string, eventType: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const events = await firstValueFrom(
        this.api.getRaffleEventsByType(raffleId, eventType)
      );

      this.eventsMap.update(map => {
        const newMap = new Map(map);
        newMap.set(raffleId, events);
        return newMap;
      });
    } catch (err: any) {
      this.error.set(err?.message || 'Error loading events by type');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Refresh events (útil después de acciones importantes)
  async refreshEvents(raffleId: string): Promise<void> {
    await this.loadEvents(raffleId);
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