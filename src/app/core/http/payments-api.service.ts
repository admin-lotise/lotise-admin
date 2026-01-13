import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment, ValidatePaymentRequest, RejectPaymentRequest } from '../../shared/models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/payments`;

  // Obtener pagos de una rifa
  getRafflePayments(raffleId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/raffle/${raffleId}`);
  }

  // Obtener un pago específico
  getPayment(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${paymentId}`);
  }

  // Validar pago (marca como Confirmed y mueve tickets)
  validatePayment(request: ValidatePaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(
      `${this.baseUrl}/${request.paymentId}/validate`,
      request
    );
  }

  // Rechazar pago
  rejectPayment(request: RejectPaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(
      `${this.baseUrl}/${request.paymentId}/reject`,
      request
    );
  }
}