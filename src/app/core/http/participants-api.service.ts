import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Participant } from '../../shared/models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/raffles`;

  // Obtener participantes de una rifa (agrupados por buyerPhone)
  getRaffleParticipants(raffleId: string): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.baseUrl}/${raffleId}/participants`);
  }

  // Obtener detalle de un participante
  getParticipant(raffleId: string, buyerPhone: string): Observable<Participant> {
    return this.http.get<Participant>(
      `${this.baseUrl}/${raffleId}/participants/${buyerPhone}`
    );
  }
}