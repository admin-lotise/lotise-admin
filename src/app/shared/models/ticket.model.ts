// ==================== TICKET (Tabla principal) ====================
export interface Ticket {
  raffleId: string;
  number: string;
  ticketId: string;
  status: TicketStatus;
  paidAt?: string;
  parentId?: string | null;
  opportunities?: string[];
  
  // Buyer info (cuando está pagado)
  buyerFirstName?: string;
  buyerLastName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  country?: string;
  state?: string;
}

// ==================== TICKET AUX (Reservas temporales) ====================
export interface TicketAux {
  raffleId: string;
  number: string;
  tenantId: string;
  reservedAt: string;
  ttl: number; // Unix timestamp
  parentId?: string | null;
  opportunities?: string[];
  
  // Buyer info
  buyerFirstName: string;
  buyerLastName: string;
  buyerPhone: string;
  buyerEmail?: string;
  country: string;
  state: string;
}

// ==================== PAYMENT ====================
export interface Payment {
  paymentId: string;
  tenantId: string;
  raffleId: string;
  ticketIds: string[];
  
  // Amount
  amount: number;
  currency: string;
  
  // Payment info
  method: PaymentMethod;
  status: PaymentStatus;
  
  // Buyer info
  buyerFirstName: string;
  buyerLastName: string;
  buyerPhone: string;
  buyerEmail?: string;
  country: string;
  state: string;
  
  // Timestamps
  createdAt: string;
  validatedAt?: string;
  rejectedAt?: string;
  
  // Metadata
  metadata?: {
    proofUrl?: string; // URL del comprobante
    notes?: string;
    validatedBy?: string; // Admin que validó
    rejectionReason?: string;
  };
}

// ==================== PARTICIPANT (Vista agregada) ====================
export interface Participant {
  raffleId: string;
  buyerPhone: string; // Unique identifier
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail?: string;
  country: string;
  state: string;
  
  // Stats
  totalTickets: number;
  paidTickets: number;
  reservedTickets: number;
  totalPaid: number;
  
  // Lists
  tickets: string[]; // Números de boletos
  payments: Payment[];
  
  // Timestamps
  firstPurchase: string;
  lastPurchase: string;
}

// ==================== RAFFLE EVENT (Para historial) ====================
export interface RaffleEvent {
  eventId: string;
  raffleId: string;
  tenantId: string;
  eventType: RaffleEventType;
  timestamp: string;
  
  // Event details
  description: string;
  metadata?: {
    ticketNumbers?: string[];
    buyerPhone?: string;
    paymentId?: string;
    userId?: string; // Admin que realizó la acción
    oldStatus?: string;
    newStatus?: string;
  };
}

// ==================== ENUMS ====================
export type TicketStatus = 'Available' | 'Reserved' | 'Paid';

export type PaymentMethod = 
  | 'transfer' 
  | 'cash' 
  | 'card' 
  | 'paypal' 
  | 'other';

export type PaymentStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Rejected';

export type RaffleEventType = 
  | 'raffle_created'
  | 'raffle_updated'
  | 'tickets_reserved'
  | 'payment_created'
  | 'payment_validated'
  | 'payment_rejected'
  | 'tickets_paid'
  | 'raffle_drawn'
  | 'winner_selected';

// ==================== REQUEST/RESPONSE TYPES ====================
export interface CreateTicketsAuxRequest {
  tenantId: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerPhone: string;
  buyerEmail?: string;
  country: string;
  state: string;
  tickets: {
    number: string;
    opportunities?: string[];
  }[];
  opportunitiesEnabled: boolean;
  opportunitiesCount?: number;
}

export interface ValidatePaymentRequest {
  paymentId: string;
  validatedBy: string; // Admin user ID
  notes?: string;
}

export interface RejectPaymentRequest {
  paymentId: string;
  rejectedBy: string; // Admin user ID
  reason: string;
}