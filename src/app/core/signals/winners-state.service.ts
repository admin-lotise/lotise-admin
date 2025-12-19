import { Injectable, signal, computed } from '@angular/core';
import { Winner } from '../../shared/models/winner.model';

@Injectable({
  providedIn: 'root'
})
export class WinnersStateService {
  // Signal privado para los ganadores
  private readonly _winners = signal<Winner[]>([]);

  // Signal público (readonly)
  readonly winners = this._winners.asReadonly();

  // Computed signals útiles
  readonly activeWinners = computed(() => 
    this._winners().filter(w => w.isActive).sort((a, b) => 
      b.drawDate.getTime() - a.drawDate.getTime()
    )
  );

  readonly recentWinners = computed(() => 
    this.activeWinners().slice(0, 5)
  );

  readonly totalWinners = computed(() => this._winners().length);

  readonly hasWinners = computed(() => this._winners().length > 0);

  /**
   * Establecer lista completa de ganadores
   */
  setWinners(winners: Winner[]): void {
    this._winners.set(winners);
  }

  /**
   * Agregar nuevo ganador
   */
  addWinner(winner: Winner): void {
    this._winners.update(winners => [...winners, winner]);
  }

  /**
   * Actualizar ganador existente
   */
  updateWinner(id: string, updates: Partial<Winner>): void {
    this._winners.update(winners =>
      winners.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w)
    );
  }

  /**
   * Eliminar ganador
   */
  deleteWinner(id: string): void {
    this._winners.update(winners => winners.filter(w => w.id !== id));
  }

  /**
   * Filtrar por rifa
   */
  getWinnersByRaffle(raffleId: string): Winner[] {
    return this._winners().filter(w => w.raffleId === raffleId);
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._winners.set([]);
  }
}