export enum RaffleStatus {
  DRAFT = 'DRAFT',           // Borrador
  SCHEDULED = 'SCHEDULED',   // Programada
  ACTIVE = 'ACTIVE',         // Activa (vendiendo)
  PAUSED = 'PAUSED',         // Pausada
  SOLD_OUT = 'SOLD_OUT',     // Agotada
  DRAWN = 'DRAWN',           // Sorteada
  COMPLETED = 'COMPLETED',   // Completada (ganador cobró)
  CANCELLED = 'CANCELLED'    // Cancelada
}

export enum RaffleType {
  TRADITIONAL = 'TRADITIONAL',  // Rifa tradicional (tómbola física)
  DIGITAL = 'DIGITAL',          // Sorteo digital automático
  HYBRID = 'HYBRID'             // Combinado
}

export enum TicketPriceType {
  FIXED = 'FIXED',              // Precio fijo por boleto
  PACKAGE = 'PACKAGE',          // Paquetes (ej: 3x$100, 5x$150)
  DYNAMIC = 'DYNAMIC'           // Precio variable según cantidad
}

// ✅ NUEVO: Tipo de lotería
export enum LotteryType {
  LOTERIA_NACIONAL = 'Loteria Nacional',
  MELATE = 'Melate',
  CHISPAZO = 'Chispazo',
  TRIS = 'Tris',
  CUSTOM = 'Personalizado'
}

// ✅ Interfaz para premios
export interface RafflePrize {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  estimatedValue: number;
  position: number;            // 1er lugar, 2do lugar, etc.
}

// ✅ Interfaz para paquetes/combos
export interface TicketPackage {
  quantity: number;
  price: number;                // totalPrice en tu API
  discount?: number;            // % de descuento (calculado)
  label?: string;               // Ej: "Mejor valor", "Más popular"
}

// ✅ NUEVO: Interfaz para oportunidades
export interface OpportunityConfig {
  enabled: boolean;
  count: number;                // Número de oportunidades adicionales
  description?: string;         // Descripción de qué son las oportunidades
}

// ✅ NUEVO: Interfaz para FAQs
export interface RaffleFAQ {
  id?: string;
  question: string;
  answer: string;
}

// ✅ NUEVO: Interfaz para textos adicionales
export interface AdditionalTexts {
  additionalInfo?: string;      // Texto adicional general
  participationRules?: string;  // Reglas de participación
  deliveryTerms?: string;       // Términos de entrega del premio
  disclaimer?: string;          // Avisos legales adicionales
}

// ✅ Interfaz principal de Rifa
export interface Raffle {
  id: string;
  tenantId: string;
  categoryId?: string;          // ✅ NUEVO: Categoría de la rifa
  
  // Información básica
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];            // ✅ Array de imágenes (tu API usa "images")
  additionalImages?: string[];  // Alias para compatibilidad
  
  // Configuración
  raffleType: RaffleType;
  status: RaffleStatus;
  
  // ✅ NUEVO: Configuración de lotería
  lottery: LotteryType | string; // Tipo de lotería utilizada
  
  // Boletos
  totalTickets: number;
  soldTickets: number;
  reservedTickets: number;
  availableTickets: number;    // totalTickets - soldTickets - reservedTickets
  
  // Precios
  ticketPriceType: TicketPriceType;
  baseTicketPrice: number;     // ✅ Renombrado de ticketPrice (tu API usa baseTicketPrice)
  ticketPrice: number;         // Alias para compatibilidad
  comboPrices?: TicketPackage[]; // ✅ Tu API usa "comboPrices"
  packages?: TicketPackage[];  // Alias para compatibilidad
  
  // Premios
  prizes: RafflePrize[];
  
  // Fechas
  startDate?: Date;            // Inicio de ventas (opcional)
  endDate?: Date;              // Fin de ventas (opcional)
  drawDate: Date;              // Fecha del sorteo
  coveredUntil?: Date;         // ✅ NUEVO: Fecha hasta la que está cubierta
  
  // Sorteo
  drawMethod?: 'AUTOMATIC' | 'MANUAL' | 'PHYSICAL';
  winningNumbers?: number[];   // Números ganadores (después del sorteo)
  
  // ✅ NUEVO: Oportunidades
  opportunitiesEnabled: boolean;
  opportunitiesCount?: number;
  opportunities?: OpportunityConfig;
  
  // ✅ NUEVO: Textos adicionales
  additionalTexts?: AdditionalTexts;
  
  // ✅ NUEVO: FAQs
  faqs?: RaffleFAQ[];
  
  // Configuración adicional
  allowReservations: boolean;
  reservationTimeMinutes: number;
  maxTicketsPerPerson?: number;
  minTicketsToActivate?: number;
  defaultRaffle?: boolean;     // ✅ NUEVO: Si es la rifa por defecto
  
  // Legal
  termsAndConditions?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy?: string;
}

// ✅ DTO para crear rifa (compatible con tu API)
export interface CreateRaffleDto {
  tenantId: string;
  categoryId?: string;
  
  // Básico
  title: string;
  description: string;
  images?: string[];
  
  // Precios y boletos
  baseTicketPrice: number;
  comboPrices?: Array<{
    quantity: number;
    totalPrice: number;
  }>;
  totalTickets: number;
  
  // Lotería
  lottery: string;
  
  // Oportunidades
  opportunitiesEnabled: boolean;
  opportunitiesCount?: number;
  
  // Fechas
  coveredUntil?: string;        // ISO string
  drawDate?: string;            // ISO string
  
  // Configuración
  defaultRaffle?: boolean;
  
  // FAQs
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  
  // Textos adicionales
  additionalTexts?: AdditionalTexts;
  
  // Premios
  prizes?: Array<{
    name: string;
    description?: string;
    imageUrl?: string;
    estimatedValue: number;
    position: number;
  }>;
  
  // Opcional
  raffleType?: RaffleType;
  allowReservations?: boolean;
  reservationTimeMinutes?: number;
  maxTicketsPerPerson?: number;
  minTicketsToActivate?: number;
  termsAndConditions?: string;
}

// ✅ DTO para actualizar rifa
export interface UpdateRaffleDto extends Partial<CreateRaffleDto> {
  status?: RaffleStatus;
}

// DTOs para filtros y búsqueda
export interface RaffleFilters {
  status?: RaffleStatus[];
  raffleType?: RaffleType[];
  categoryId?: string;
  lottery?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface RaffleStats {
  totalRaffles: number;
  activeRaffles: number;
  completedRaffles: number;
  totalRevenue: number;
  totalTicketsSold: number;
  averageTicketPrice: number;
}