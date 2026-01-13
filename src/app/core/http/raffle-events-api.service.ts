import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RaffleEvent } from '../../shared/models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class RaffleEventsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/raffles`;

  /**
   * Obtener historial de eventos de una rifa
   * GET /raffles/{raffleId}/events
   */
  getRaffleEvents(raffleId: string): Observable<RaffleEvent[]> {
    return this.http.get<RaffleEvent[]>(`${this.baseUrl}/${raffleId}/events`);
  }

  /**
   * Obtener eventos filtrados por tipo
   * GET /raffles/{raffleId}/events?type={eventType}
   */
  getRaffleEventsByType(raffleId: string, eventType: string): Observable<RaffleEvent[]> {
    return this.http.get<RaffleEvent[]>(
      `${this.baseUrl}/${raffleId}/events?type=${eventType}`
    );
  }
}