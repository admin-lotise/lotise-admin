import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  Raffle, 
  CreateRaffleDto, 
  UpdateRaffleDto,
  RaffleFilters,
  RaffleStats,
  RaffleStatus,
  RaffleType,
  TicketPriceType
} from '../../shared/models/raffle.model';

@Injectable({
  providedIn: 'root'
})
export class RafflesApiService {
  private readonly apiUrl = '/api';
  private readonly USE_MOCK_DATA = true;

  // Mock data
  private mockRaffles: Raffle[] = [
    {
      id: '1',
      tenantId: 'tenant-demo',
      categoryId: 'tech',
      title: 'Rifa iPhone 15 Pro Max',
      description: 'Gana el último iPhone 15 Pro Max de 256GB en color Titanio Natural',
      imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium.jpeg',
      images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium.jpeg'],
      raffleType: RaffleType.DIGITAL,
      status: RaffleStatus.ACTIVE,
      totalTickets: 1000,
      soldTickets: 647,
      reservedTickets: 23,
      availableTickets: 330,
      ticketPriceType: TicketPriceType.PACKAGE,
      ticketPrice: 50,
      baseTicketPrice: 50,
      packages: [
        { quantity: 1, price: 50 },
        { quantity: 3, price: 130, discount: 13.33, label: 'Popular' },
        { quantity: 5, price: 200, discount: 20, label: 'Mejor valor' },
        { quantity: 10, price: 350, discount: 30 }
      ],
      comboPrices: [
        { quantity: 3, price: 130 },
        { quantity: 5, price: 200 },
        { quantity: 10, price: 350 }
      ],
      prizes: [
        {
          id: 'p1',
          name: 'iPhone 15 Pro Max 256GB',
          description: 'Titanio Natural con cargador y AirPods Pro incluidos',
          estimatedValue: 35000,
          position: 1
        }
      ],
      lottery: 'Loteria Nacional',
      opportunitiesEnabled: true,
      opportunitiesCount: 4,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-01-15'),
      drawDate: new Date('2025-01-16'),
      coveredUntil: new Date('2025-01-15'),
      drawMethod: 'AUTOMATIC',
      allowReservations: true,
      reservationTimeMinutes: 15,
      maxTicketsPerPerson: 20,
      minTicketsToActivate: 500,
      faqs: [
        {
          question: '¿Cómo participar?',
          answer: 'Compra tus boletos y espera el sorteo'
        }
      ],
      createdAt: new Date('2024-11-25'),
      updatedAt: new Date('2024-12-15'),
      createdBy: 'admin'
    },
    {
      id: '2',
      tenantId: 'tenant-demo',
      categoryId: 'tech',
      title: 'Rifa MacBook Pro M3',
      description: 'MacBook Pro 14" con chip M3 Pro, 18GB RAM, 512GB SSD',
      imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpeg',
      images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpeg'],
      raffleType: RaffleType.DIGITAL,
      status: RaffleStatus.SCHEDULED,
      totalTickets: 500,
      soldTickets: 0,
      reservedTickets: 0,
      availableTickets: 500,
      ticketPriceType: TicketPriceType.FIXED,
      ticketPrice: 100,
      baseTicketPrice: 100,
      prizes: [
        {
          id: 'p2',
          name: 'MacBook Pro 14" M3 Pro',
          estimatedValue: 55000,
          position: 1
        }
      ],
      lottery: 'Loteria Nacional',
      opportunitiesEnabled: false,
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-02-28'),
      drawDate: new Date('2025-03-01'),
      coveredUntil: new Date('2025-02-28'),
      drawMethod: 'AUTOMATIC',
      allowReservations: true,
      reservationTimeMinutes: 10,
      createdAt: new Date('2024-12-10'),
      updatedAt: new Date('2024-12-10'),
      createdBy: 'admin'
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las rifas con filtros
   */
  getRaffles(tenantId: string, filters?: RaffleFilters): Observable<Raffle[]> {
    if (this.USE_MOCK_DATA) {
      let filtered = this.mockRaffles.filter(r => r.tenantId === tenantId);

      if (filters?.status?.length) {
        filtered = filtered.filter(r => filters.status!.includes(r.status));
      }

      if (filters?.raffleType?.length) {
        filtered = filtered.filter(r => filters.raffleType!.includes(r.raffleType));
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(r => 
          r.title.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search)
        );
      }

      return of(filtered).pipe(delay(500));
    }

    return this.http.get<Raffle[]>(`${this.apiUrl}/tenants/${tenantId}/raffles`, { params: filters as any });
  }

  /**
   * Obtener una rifa por ID
   */
  getRaffle(tenantId: string, raffleId: string): Observable<Raffle> {
    if (this.USE_MOCK_DATA) {
      const raffle = this.mockRaffles.find(r => r.id === raffleId && r.tenantId === tenantId);
      
      if (!raffle) {
        return throwError(() => new Error('Rifa no encontrada'));
      }

      return of(raffle).pipe(delay(300));
    }

    return this.http.get<Raffle>(`${this.apiUrl}/tenants/${tenantId}/raffles/${raffleId}`);
  }

  /**
   * Crear nueva rifa
   */
  createRaffle(tenantId: string, dto: CreateRaffleDto): Observable<Raffle> {
    if (this.USE_MOCK_DATA) {
      const newRaffle: Raffle = {
        id: `raffle-${Date.now()}`,
        tenantId,
        categoryId: dto.categoryId,
        
        // Información básica
        title: dto.title,
        description: dto.description,
        imageUrl: dto.images?.[0],
        images: dto.images || [],
        
        // Tipo y estado
        raffleType: dto.raffleType || RaffleType.DIGITAL,
        status: RaffleStatus.DRAFT,
        
        // Boletos
        totalTickets: dto.totalTickets,
        soldTickets: 0,
        reservedTickets: 0,
        availableTickets: dto.totalTickets,
        
        // Precios
        ticketPriceType: TicketPriceType.PACKAGE,
        ticketPrice: dto.baseTicketPrice,
        baseTicketPrice: dto.baseTicketPrice,
        
        // Mapear comboPrices (totalPrice → price)
        comboPrices: dto.comboPrices?.map(cp => ({
          quantity: cp.quantity,
          price: cp.totalPrice
        })),
        packages: dto.comboPrices?.map(cp => ({
          quantity: cp.quantity,
          price: cp.totalPrice
        })),
        
        // Premios
        prizes: dto.prizes?.map((p, i) => ({ 
          ...p, 
          id: `prize-${Date.now()}-${i}` 
        })) || [],
        
        // Lotería
        lottery: dto.lottery,
        
        // Oportunidades
        opportunitiesEnabled: dto.opportunitiesEnabled,
        opportunitiesCount: dto.opportunitiesCount,
        
        // Fechas
        startDate: dto.drawDate ? new Date(dto.drawDate) : undefined,
        endDate: dto.coveredUntil ? new Date(dto.coveredUntil) : undefined,
        drawDate: dto.drawDate ? new Date(dto.drawDate) : new Date(),
        coveredUntil: dto.coveredUntil ? new Date(dto.coveredUntil) : undefined,
        
        // Configuración
        drawMethod: 'AUTOMATIC',
        allowReservations: dto.allowReservations ?? true,
        reservationTimeMinutes: dto.reservationTimeMinutes || 15,
        maxTicketsPerPerson: dto.maxTicketsPerPerson,
        minTicketsToActivate: dto.minTicketsToActivate,
        defaultRaffle: dto.defaultRaffle,
        
        // FAQs y textos
        faqs: dto.faqs,
        additionalTexts: dto.additionalTexts,
        termsAndConditions: dto.termsAndConditions,
        
        // Metadata
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin'
      };

      this.mockRaffles.push(newRaffle);
      return of(newRaffle).pipe(delay(500));
    }

    return this.http.post<Raffle>(`${this.apiUrl}/tenants/${tenantId}/raffles`, dto);
  }

  /**
   * Actualizar rifa
   */
  updateRaffle(tenantId: string, raffleId: string, dto: UpdateRaffleDto): Observable<Raffle> {
    if (this.USE_MOCK_DATA) {
      const index = this.mockRaffles.findIndex(r => r.id === raffleId && r.tenantId === tenantId);
      
      if (index === -1) {
        return throwError(() => new Error('Rifa no encontrada'));
      }

      const existingRaffle = this.mockRaffles[index];

      // Actualizar premios si se proporcionan
      const updatedPrizes = dto.prizes 
        ? dto.prizes.map((p, i) => {
            const existingPrize = existingRaffle.prizes[i];
            return {
              ...p,
              id: existingPrize?.id || `prize-${Date.now()}-${i}`
            };
          })
        : existingRaffle.prizes;

      // Actualizar combos mapeando totalPrice → price
      const updatedComboPrices = dto.comboPrices 
        ? dto.comboPrices.map(cp => ({
            quantity: cp.quantity,
            price: cp.totalPrice
          }))
        : existingRaffle.comboPrices;

      const updatedPackages = dto.comboPrices
        ? dto.comboPrices.map(cp => ({
            quantity: cp.quantity,
            price: cp.totalPrice
          }))
        : existingRaffle.packages;

      // ✅ FIX: Convertir fechas string → Date
      const updateData: Partial<Raffle> = {
        // Solo incluir campos que realmente cambien
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.images && { 
          images: dto.images,
          imageUrl: dto.images[0] 
        }),
        ...(dto.baseTicketPrice && { 
          baseTicketPrice: dto.baseTicketPrice,
          ticketPrice: dto.baseTicketPrice 
        }),
        ...(dto.totalTickets && { totalTickets: dto.totalTickets }),
        ...(dto.lottery && { lottery: dto.lottery }),
        ...(dto.opportunitiesEnabled !== undefined && { 
          opportunitiesEnabled: dto.opportunitiesEnabled 
        }),
        ...(dto.opportunitiesCount && { opportunitiesCount: dto.opportunitiesCount }),
        ...(dto.status && { status: dto.status }),
        ...(dto.raffleType && { raffleType: dto.raffleType }),
        ...(dto.allowReservations !== undefined && { 
          allowReservations: dto.allowReservations 
        }),
        ...(dto.reservationTimeMinutes && { 
          reservationTimeMinutes: dto.reservationTimeMinutes 
        }),
        ...(dto.maxTicketsPerPerson && { maxTicketsPerPerson: dto.maxTicketsPerPerson }),
        ...(dto.minTicketsToActivate && { minTicketsToActivate: dto.minTicketsToActivate }),
        ...(dto.defaultRaffle !== undefined && { defaultRaffle: dto.defaultRaffle }),
        ...(dto.faqs && { faqs: dto.faqs }),
        ...(dto.additionalTexts && { additionalTexts: dto.additionalTexts }),
        ...(dto.termsAndConditions && { termsAndConditions: dto.termsAndConditions }),
        
        // ✅ Convertir fechas string → Date
        ...(dto.drawDate && { drawDate: new Date(dto.drawDate) }),
        ...(dto.coveredUntil && { coveredUntil: new Date(dto.coveredUntil) }),
        
        // Arrays procesados
        comboPrices: updatedComboPrices,
        packages: updatedPackages,
        prizes: updatedPrizes,
        
        // Metadata
        updatedAt: new Date(),
        lastModifiedBy: 'admin'
      };

      this.mockRaffles[index] = {
        ...existingRaffle,
        ...updateData
      };

      return of(this.mockRaffles[index]).pipe(delay(500));
    }

    return this.http.patch<Raffle>(`${this.apiUrl}/tenants/${tenantId}/raffles/${raffleId}`, dto);
  }

  /**
   * Eliminar rifa
   */
  deleteRaffle(tenantId: string, raffleId: string): Observable<void> {
    if (this.USE_MOCK_DATA) {
      const index = this.mockRaffles.findIndex(r => r.id === raffleId && r.tenantId === tenantId);
      
      if (index === -1) {
        return throwError(() => new Error('Rifa no encontrada'));
      }

      this.mockRaffles.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(`${this.apiUrl}/tenants/${tenantId}/raffles/${raffleId}`);
  }

  /**
   * Obtener estadísticas
   */
  getStats(tenantId: string): Observable<RaffleStats> {
    if (this.USE_MOCK_DATA) {
      const raffles = this.mockRaffles.filter(r => r.tenantId === tenantId);
      
      const stats: RaffleStats = {
        totalRaffles: raffles.length,
        activeRaffles: raffles.filter(r => r.status === RaffleStatus.ACTIVE).length,
        completedRaffles: raffles.filter(r => r.status === RaffleStatus.COMPLETED).length,
        totalRevenue: raffles.reduce((sum, r) => sum + (r.soldTickets * r.baseTicketPrice), 0),
        totalTicketsSold: raffles.reduce((sum, r) => sum + r.soldTickets, 0),
        averageTicketPrice: raffles.length > 0 
          ? raffles.reduce((sum, r) => sum + r.baseTicketPrice, 0) / raffles.length 
          : 0
      };

      return of(stats).pipe(delay(300));
    }

    return this.http.get<RaffleStats>(`${this.apiUrl}/tenants/${tenantId}/raffles/stats`);
  }
}