import { Injectable, inject, signal, computed } from '@angular/core';
import { ParticipantsApiService } from '../http/participants-api.service';
import { Participant } from '../../shared/models/ticket.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaffleParticipantsStateService {
  private api = inject(ParticipantsApiService);

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

      const participants = await firstValueFrom(
        this.api.getRaffleParticipants(raffleId)
      );

      this.participantsMap.update(map => {
        const newMap = new Map(map);
        newMap.set(raffleId, participants);
        return newMap;
      });
    } catch (err: any) {
      this.error.set(err?.message || 'Error loading participants');
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