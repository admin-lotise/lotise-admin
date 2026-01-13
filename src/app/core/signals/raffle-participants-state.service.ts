import { Injectable, signal, computed, inject } from '@angular/core';
import { Participant } from '../../shared/models/ticket.model';
import { RaffleMockDataService } from '../services/raffle-mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RaffleParticipantsStateService {
  private mockData = inject(RaffleMockDataService);

  // State
  private participantsMap = signal<Map<string, Participant[]>>(new Map());
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Get participants for specific raffle
  getParticipants(raffleId: string) {
    return computed(() => this.participantsMap().get(raffleId) || []);
  }

  // Load participants
  async loadParticipants(raffleId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // ==================== USAR MOCK DATA ====================
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockParticipants = this.mockData.getMockParticipants(raffleId);
      this.participantsMap.update(map => {
        map.set(raffleId, mockParticipants);
        return new Map(map);
      });

      // TODO: Reemplazar con llamada real al API
      // const response = await firstValueFrom(this.participantsApi.getParticipants(raffleId));
      // this.participantsMap.update(map => {
      //   map.set(raffleId, response);
      //   return new Map(map);
      // });

    } catch (err: any) {
      this.error.set(err?.message || 'Error al cargar los participantes');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Refresh after payment validation
  async refreshAfterPayment(raffleId: string): Promise<void> {
    await this.loadParticipants(raffleId);
  }

  // Clear cache
  clearCache(raffleId?: string): void {
    if (raffleId) {
      this.participantsMap.update(map => {
        const newMap = new Map(map);
        newMap.delete(raffleId);
        return newMap;
      });
    } else {
      this.participantsMap.set(new Map());
    }
  }
}