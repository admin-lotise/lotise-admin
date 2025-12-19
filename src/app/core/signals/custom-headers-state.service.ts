import { Injectable, signal, computed } from '@angular/core';
import { CustomHeader } from '../../shared/models/custom-header.model';

@Injectable({
  providedIn: 'root'
})
export class CustomHeadersStateService {
  // Signal privado para los headers
  private readonly _headers = signal<CustomHeader[]>([]);

  // Signal público (readonly)
  readonly headers = this._headers.asReadonly();

  // Computed signals útiles
  readonly activeHeaders = computed(() => {
    const now = new Date();
    return this._headers()
      .filter(h => {
        if (!h.isActive) return false;
        if (h.startDate && h.startDate > now) return false;
        if (h.endDate && h.endDate < now) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  });

  readonly totalHeaders = computed(() => this._headers().length);

  readonly hasActiveHeaders = computed(() => this.activeHeaders().length > 0);

  /**
   * Establecer lista completa de headers
   */
  setHeaders(headers: CustomHeader[]): void {
    this._headers.set(headers);
  }

  /**
   * Agregar nuevo header
   */
  addHeader(header: CustomHeader): void {
    this._headers.update(headers => [...headers, header]);
  }

  /**
   * Actualizar header existente
   */
  updateHeader(id: string, updates: Partial<CustomHeader>): void {
    this._headers.update(headers =>
      headers.map(h => h.id === id ? { ...h, ...updates, updatedAt: new Date() } : h)
    );
  }

  /**
   * Eliminar header
   */
  deleteHeader(id: string): void {
    this._headers.update(headers => headers.filter(h => h.id !== id));
  }

  /**
   * Reordenar headers
   */
  reorderHeaders(orderedIds: string[]): void {
    this._headers.update(headers => {
      const headerMap = new Map(headers.map(h => [h.id, h]));
      return orderedIds
        .map((id, index) => {
          const header = headerMap.get(id);
          return header ? { ...header, order: index } : null;
        })
        .filter((h): h is CustomHeader => h !== null);
    });
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._headers.set([]);
  }
}