import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketAux, CreateTicketsAuxRequest } from '../../shared/models/ticket.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/tickets`;

  // Obtener todos los tickets de una rifa (Paid)
  getRaffleTickets(raffleId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/${raffleId}`);
  }

  // Obtener tickets reservados (TicketsAux)
  getRaffleReservedTickets(raffleId: string): Observable<TicketAux[]> {
    return this.http.get<TicketAux[]>(`${this.baseUrl}-aux/${raffleId}`);
  }

  // Crear reserva de tickets
  createReservation(request: CreateTicketsAuxRequest): Observable<TicketAux[]> {
    return this.http.post<TicketAux[]>(`${this.baseUrl}-aux`, request);
  }
}