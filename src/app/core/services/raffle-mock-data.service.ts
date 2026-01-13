import { Injectable } from '@angular/core';
import { 
  Ticket, 
  TicketAux, 
  RaffleEvent, 
  Payment, 
  Participant 
} from '../../shared/models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class RaffleMockDataService {

  // ==================== MOCK PAYMENTS ====================
  getMockPayments(raffleId: string): Payment[] {
    return [
      {
        paymentId: 'pay-001',
        tenantId: 'tenant-demo',
        raffleId: raffleId,
        ticketIds: ['ticket-001', 'ticket-002', 'ticket-003'],
        amount: 300,
        currency: 'MXN',
        method: 'transfer',
        status: 'Pending',
        buyerFirstName: 'Juan',
        buyerLastName: 'Pérez García',
        buyerPhone: '5551234567',
        country: 'MX',
        state: 'CDMX',
        createdAt: new Date('2024-01-10T10:30:00').toISOString(),
        metadata: {
          proofUrl: 'https://picsum.photos/400/600?random=1'
        }
      },
      {
        paymentId: 'pay-002',
        tenantId: 'tenant-demo',
        raffleId: raffleId,
        ticketIds: ['ticket-005', 'ticket-010', 'ticket-015', 'ticket-020', 'ticket-025'],
        amount: 450,
        currency: 'MXN',
        method: 'transfer',
        status: 'Confirmed',
        buyerFirstName: 'María',
        buyerLastName: 'González López',
        buyerPhone: '5559876543',
        country: 'MX',
        state: 'Jalisco',
        createdAt: new Date('2024-01-10T11:15:00').toISOString(),
        validatedAt: new Date('2024-01-10T11:45:00').toISOString(),
        metadata: {
          proofUrl: 'https://picsum.photos/400/600?random=2',
          validatedBy: 'Admin Usuario'
        }
      },
      {
        paymentId: 'pay-003',
        tenantId: 'tenant-demo',
        raffleId: raffleId,
        ticketIds: ['ticket-007'],
        amount: 100,
        currency: 'MXN',
        method: 'cash',
        status: 'Rejected',
        buyerFirstName: 'Carlos',
        buyerLastName: 'Rodríguez',
        buyerPhone: '5552468135',
        country: 'MX',
        state: 'Nuevo León',
        createdAt: new Date('2024-01-10T12:00:00').toISOString(),
        rejectedAt: new Date('2024-01-10T12:30:00').toISOString(),
        metadata: {
          proofUrl: 'https://picsum.photos/400/600?random=3',
          rejectionReason: 'Comprobante ilegible'
        }
      },
      {
        paymentId: 'pay-004',
        tenantId: 'tenant-demo',
        raffleId: raffleId,
        ticketIds: ['ticket-030', 'ticket-031'],
        amount: 180,
        currency: 'MXN',
        method: 'transfer',
        status: 'Pending',
        buyerFirstName: 'Ana',
        buyerLastName: 'Martínez',
        buyerPhone: '5553691470',
        country: 'MX',
        state: 'Puebla',
        createdAt: new Date('2024-01-10T14:20:00').toISOString(),
        metadata: {
          proofUrl: 'https://picsum.photos/400/600?random=4'
        }
      },
      {
        paymentId: 'pay-005',
        tenantId: 'tenant-demo',
        raffleId: raffleId,
        ticketIds: ['ticket-050', 'ticket-051', 'ticket-052', 'ticket-053', 'ticket-054', 'ticket-055'],
        amount: 540,
        currency: 'MXN',
        method: 'cash',
        status: 'Confirmed',
        buyerFirstName: 'Luis',
        buyerLastName: 'Hernández',
        buyerPhone: '5558523697',
        country: 'MX',
        state: 'Veracruz',
        createdAt: new Date('2024-01-10T15:00:00').toISOString(),
        validatedAt: new Date('2024-01-10T15:20:00').toISOString(),
        metadata: {
          proofUrl: 'https://picsum.photos/400/600?random=5',
          validatedBy: 'Admin Usuario'
        }
      }
    ];
  }

  // ==================== MOCK PARTICIPANTS ====================
  getMockParticipants(raffleId: string): Participant[] {
    return [
      {
        raffleId: raffleId,
        buyerPhone: '5551234567',
        buyerFirstName: 'Juan',
        buyerLastName: 'Pérez García',
        buyerEmail: 'juan.perez@email.com',
        country: 'MX',
        state: 'CDMX',
        totalTickets: 3,
        paidTickets: 3,
        reservedTickets: 0,
        totalPaid: 300,
        tickets: ['001', '002', '003'],
        payments: [],
        firstPurchase: new Date('2024-01-10T10:30:00').toISOString(),
        lastPurchase: new Date('2024-01-10T10:30:00').toISOString()
      },
      {
        raffleId: raffleId,
        buyerPhone: '5559876543',
        buyerFirstName: 'María',
        buyerLastName: 'González López',
        buyerEmail: 'maria.gonzalez@email.com',
        country: 'MX',
        state: 'Jalisco',
        totalTickets: 5,
        paidTickets: 5,
        reservedTickets: 0,
        totalPaid: 450,
        tickets: ['005', '010', '015', '020', '025'],
        payments: [],
        firstPurchase: new Date('2024-01-10T11:15:00').toISOString(),
        lastPurchase: new Date('2024-01-10T11:15:00').toISOString()
      },
      {
        raffleId: raffleId,
        buyerPhone: '5552468135',
        buyerFirstName: 'Carlos',
        buyerLastName: 'Rodríguez',
        buyerEmail: 'carlos.rodriguez@email.com',
        country: 'MX',
        state: 'Nuevo León',
        totalTickets: 2,
        paidTickets: 0,
        reservedTickets: 2,
        totalPaid: 0,
        tickets: ['007', '008'],
        payments: [],
        firstPurchase: new Date('2024-01-10T12:00:00').toISOString(),
        lastPurchase: new Date('2024-01-10T12:00:00').toISOString()
      },
      {
        raffleId: raffleId,
        buyerPhone: '5553691470',
        buyerFirstName: 'Ana',
        buyerLastName: 'Martínez',
        buyerEmail: 'ana.martinez@email.com',
        country: 'MX',
        state: 'Puebla',
        totalTickets: 2,
        paidTickets: 0,
        reservedTickets: 2,
        totalPaid: 0,
        tickets: ['030', '031'],
        payments: [],
        firstPurchase: new Date('2024-01-10T14:20:00').toISOString(),
        lastPurchase: new Date('2024-01-10T14:20:00').toISOString()
      },
      {
        raffleId: raffleId,
        buyerPhone: '5558523697',
        buyerFirstName: 'Luis',
        buyerLastName: 'Hernández',
        buyerEmail: 'luis.hernandez@email.com',
        country: 'MX',
        state: 'Veracruz',
        totalTickets: 6,
        paidTickets: 6,
        reservedTickets: 0,
        totalPaid: 540,
        tickets: ['050', '051', '052', '053', '054', '055'],
        payments: [],
        firstPurchase: new Date('2024-01-10T15:00:00').toISOString(),
        lastPurchase: new Date('2024-01-10T15:00:00').toISOString()
      },
      {
        raffleId: raffleId,
        buyerPhone: '5554567890',
        buyerFirstName: 'Sofia',
        buyerLastName: 'Ramírez',
        buyerEmail: 'sofia.ramirez@email.com',
        country: 'MX',
        state: 'Guanajuato',
        totalTickets: 4,
        paidTickets: 4,
        reservedTickets: 0,
        totalPaid: 360,
        tickets: ['060', '061', '062', '063'],
        payments: [],
        firstPurchase: new Date('2024-01-09T09:30:00').toISOString(),
        lastPurchase: new Date('2024-01-09T09:30:00').toISOString()
      },
      {
        raffleId: raffleId,
        buyerPhone: '5557891234',
        buyerFirstName: 'Pedro',
        buyerLastName: 'Torres',
        buyerEmail: 'pedro.torres@email.com',
        country: 'MX',
        state: 'Querétaro',
        totalTickets: 8,
        paidTickets: 8,
        reservedTickets: 0,
        totalPaid: 640,
        tickets: ['070', '071', '072', '073', '074', '075', '076', '077'],
        payments: [],
        firstPurchase: new Date('2024-01-09T14:00:00').toISOString(),
        lastPurchase: new Date('2024-01-09T14:00:00').toISOString()
      }
    ];
  }

  // ==================== MOCK TICKETS ====================
  getMockTickets(raffleId: string): { paid: Ticket[], reserved: TicketAux[] } {
    return {
      paid: [
        // Juan Pérez - 3 boletos
        { ticketId: 'ticket-001', raffleId, number: '001', status: 'Paid', buyerFirstName: 'Juan', buyerLastName: 'Pérez García', buyerPhone: '5551234567', country: 'MX', state: 'CDMX', paidAt: new Date('2024-01-10T10:30:00').toISOString(), opportunities: ['001'] },
        { ticketId: 'ticket-002', raffleId, number: '002', status: 'Paid', buyerFirstName: 'Juan', buyerLastName: 'Pérez García', buyerPhone: '5551234567', country: 'MX', state: 'CDMX', paidAt: new Date('2024-01-10T10:30:00').toISOString(), opportunities: ['002'] },
        { ticketId: 'ticket-003', raffleId, number: '003', status: 'Paid', buyerFirstName: 'Juan', buyerLastName: 'Pérez García', buyerPhone: '5551234567', country: 'MX', state: 'CDMX', paidAt: new Date('2024-01-10T10:30:00').toISOString(), opportunities: ['003'] },
        
        // María González - 5 boletos
        { ticketId: 'ticket-005', raffleId, number: '005', status: 'Paid', buyerFirstName: 'María', buyerLastName: 'González López', buyerPhone: '5559876543', country: 'MX', state: 'Jalisco', paidAt: new Date('2024-01-10T11:15:00').toISOString(), opportunities: ['005', 'A05'] },
        { ticketId: 'ticket-010', raffleId, number: '010', status: 'Paid', buyerFirstName: 'María', buyerLastName: 'González López', buyerPhone: '5559876543', country: 'MX', state: 'Jalisco', paidAt: new Date('2024-01-10T11:15:00').toISOString(), opportunities: ['010', 'A10'] },
        { ticketId: 'ticket-015', raffleId, number: '015', status: 'Paid', buyerFirstName: 'María', buyerLastName: 'González López', buyerPhone: '5559876543', country: 'MX', state: 'Jalisco', paidAt: new Date('2024-01-10T11:15:00').toISOString(), opportunities: ['015'] },
        { ticketId: 'ticket-020', raffleId, number: '020', status: 'Paid', buyerFirstName: 'María', buyerLastName: 'González López', buyerPhone: '5559876543', country: 'MX', state: 'Jalisco', paidAt: new Date('2024-01-10T11:15:00').toISOString(), opportunities: ['020'] },
        { ticketId: 'ticket-025', raffleId, number: '025', status: 'Paid', buyerFirstName: 'María', buyerLastName: 'González López', buyerPhone: '5559876543', country: 'MX', state: 'Jalisco', paidAt: new Date('2024-01-10T11:15:00').toISOString(), opportunities: ['025'] },
        
        // Luis Hernández - 6 boletos
        { ticketId: 'ticket-050', raffleId, number: '050', status: 'Paid', buyerFirstName: 'Luis', buyerLastName: 'Hernández', buyerPhone: '5558523697', country: 'MX', state: 'Veracruz', paidAt: new Date('2024-01-10T15:00:00').toISOString(), opportunities: ['050', 'A50', 'B50'] },
        { ticketId: 'ticket-051', raffleId, number: '051', status: 'Paid', buyerFirstName: 'Luis', buyerLastName: 'Hernández', buyerPhone: '5558523697', country: 'MX', state: 'Veracruz', paidAt: new Date('2024-01-10T15:00:00').toISOString(), opportunities: ['051'] },
        { ticketId: 'ticket-052', raffleId, number: '052', status: 'Paid', buyerFirstName: 'Luis', buyerLastName: 'Hernández', buyerPhone: '5558523697', country: 'MX', state: 'Veracruz', paidAt: new Date('2024-01-10T15:00:00').toISOString(), opportunities: ['052'] },
        { ticketId: 'ticket-053', raffleId, number: '053', status: 'Paid', buyerFirstName: 'Luis', buyerLastName: 'Hernández', buyerPhone: '5558523697', country: 'MX', state: 'Veracruz', paidAt: new Date('2024-01-10T15:00:00').toISOString(), opportunities: ['053'] },
        { ticketId: 'ticket-054', raffleId, number: '054', status: 'Paid', buyerFirstName: 'Luis', buyerLastName: 'Hernández', buyerPhone: '5558523697', country: 'MX', state: 'Veracruz', paidAt: new Date('2024-01-10T15:00:00').toISOString(), opportunities: ['054'] },
        { ticketId: 'ticket-055', raffleId, number: '055', status: 'Paid', buyerFirstName: 'Luis', buyerLastName: 'Hernández', buyerPhone: '5558523697', country: 'MX', state: 'Veracruz', paidAt: new Date('2024-01-10T15:00:00').toISOString(), opportunities: ['055'] },

        // Sofia Ramírez - 4 boletos
        { ticketId: 'ticket-060', raffleId, number: '060', status: 'Paid', buyerFirstName: 'Sofia', buyerLastName: 'Ramírez', buyerPhone: '5554567890', country: 'MX', state: 'Guanajuato', paidAt: new Date('2024-01-09T09:30:00').toISOString(), opportunities: ['060'] },
        { ticketId: 'ticket-061', raffleId, number: '061', status: 'Paid', buyerFirstName: 'Sofia', buyerLastName: 'Ramírez', buyerPhone: '5554567890', country: 'MX', state: 'Guanajuato', paidAt: new Date('2024-01-09T09:30:00').toISOString(), opportunities: ['061'] },
        { ticketId: 'ticket-062', raffleId, number: '062', status: 'Paid', buyerFirstName: 'Sofia', buyerLastName: 'Ramírez', buyerPhone: '5554567890', country: 'MX', state: 'Guanajuato', paidAt: new Date('2024-01-09T09:30:00').toISOString(), opportunities: ['062'] },
        { ticketId: 'ticket-063', raffleId, number: '063', status: 'Paid', buyerFirstName: 'Sofia', buyerLastName: 'Ramírez', buyerPhone: '5554567890', country: 'MX', state: 'Guanajuato', paidAt: new Date('2024-01-09T09:30:00').toISOString(), opportunities: ['063'] },

        // Pedro Torres - 8 boletos
        { ticketId: 'ticket-070', raffleId, number: '070', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['070', 'A70'] },
        { ticketId: 'ticket-071', raffleId, number: '071', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['071'] },
        { ticketId: 'ticket-072', raffleId, number: '072', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['072'] },
        { ticketId: 'ticket-073', raffleId, number: '073', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['073'] },
        { ticketId: 'ticket-074', raffleId, number: '074', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['074'] },
        { ticketId: 'ticket-075', raffleId, number: '075', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['075'] },
        { ticketId: 'ticket-076', raffleId, number: '076', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['076'] },
        { ticketId: 'ticket-077', raffleId, number: '077', status: 'Paid', buyerFirstName: 'Pedro', buyerLastName: 'Torres', buyerPhone: '5557891234', country: 'MX', state: 'Querétaro', paidAt: new Date('2024-01-09T14:00:00').toISOString(), opportunities: ['077'] },
      ],
      reserved: [
        // Carlos Rodríguez - 2 boletos reservados
        { number: '007', raffleId, tenantId: 'tenant-demo', buyerFirstName: 'Carlos', buyerLastName: 'Rodríguez', buyerPhone: '5552468135', country: 'MX', state: 'Nuevo León', reservedAt: new Date('2024-01-10T12:00:00').toISOString(), ttl: Date.now() + 900000, opportunities: ['007'] },
        { number: '008', raffleId, tenantId: 'tenant-demo', buyerFirstName: 'Carlos', buyerLastName: 'Rodríguez', buyerPhone: '5552468135', country: 'MX', state: 'Nuevo León', reservedAt: new Date('2024-01-10T12:00:00').toISOString(), ttl: Date.now() + 900000, opportunities: ['008'] },
        
        // Ana Martínez - 2 boletos reservados
        { number: '030', raffleId, tenantId: 'tenant-demo', buyerFirstName: 'Ana', buyerLastName: 'Martínez', buyerPhone: '5553691470', country: 'MX', state: 'Puebla', reservedAt: new Date('2024-01-10T14:20:00').toISOString(), ttl: Date.now() + 900000, opportunities: ['030'] },
        { number: '031', raffleId, tenantId: 'tenant-demo', buyerFirstName: 'Ana', buyerLastName: 'Martínez', buyerPhone: '5553691470', country: 'MX', state: 'Puebla', reservedAt: new Date('2024-01-10T14:20:00').toISOString(), ttl: Date.now() + 900000, opportunities: ['031'] },
      ]
    };
  }

  // ==================== MOCK EVENTS ====================
  getMockEvents(raffleId: string): RaffleEvent[] {
    return [
      {
        eventId: 'evt-001',
        raffleId: raffleId,
        eventType: 'raffle_created',
        timestamp: new Date('2024-01-08T10:00:00').toISOString(),
        description: 'Rifa creada en el sistema',
        performedBy: 'Admin Usuario',
        metadata: {}
      },
      {
        eventId: 'evt-002',
        raffleId: raffleId,
        eventType: 'raffle_published',
        timestamp: new Date('2024-01-08T11:00:00').toISOString(),
        description: 'Rifa publicada y disponible para venta',
        performedBy: 'Admin Usuario',
        metadata: {}
      },
      {
        eventId: 'evt-003',
        raffleId: raffleId,
        eventType: 'tickets_reserved',
        timestamp: new Date('2024-01-09T09:30:00').toISOString(),
        description: 'Boletos reservados por comprador',
        performedBy: 'Sistema',
        metadata: {
          ticketNumbers: ['060', '061', '062', '063'],
          buyerName: 'Sofia Ramírez',
          buyerPhone: '5554567890'
        }
      },
      {
        eventId: 'evt-004',
        raffleId: raffleId,
        eventType: 'payment_created',
        timestamp: new Date('2024-01-09T09:35:00').toISOString(),
        description: 'Pago registrado pendiente de validación',
        performedBy: 'Sistema',
        metadata: {
          paymentId: 'pay-006',
          amount: 360,
          paymentMethod: 'Transferencia',
          buyerName: 'Sofia Ramírez'
        }
      },
      {
        eventId: 'evt-005',
        raffleId: raffleId,
        eventType: 'payment_validated',
        timestamp: new Date('2024-01-09T10:00:00').toISOString(),
        description: 'Pago validado correctamente',
        performedBy: 'Admin Usuario',
        metadata: {
          paymentId: 'pay-006',
          amount: 360,
          ticketNumbers: ['060', '061', '062', '063']
        }
      },
      {
        eventId: 'evt-006',
        raffleId: raffleId,
        eventType: 'tickets_reserved',
        timestamp: new Date('2024-01-09T14:00:00').toISOString(),
        description: 'Boletos reservados por comprador',
        performedBy: 'Sistema',
        metadata: {
          ticketNumbers: ['070', '071', '072', '073', '074', '075', '076', '077'],
          buyerName: 'Pedro Torres',
          buyerPhone: '5557891234'
        }
      },
      {
        eventId: 'evt-007',
        raffleId: raffleId,
        eventType: 'payment_created',
        timestamp: new Date('2024-01-09T14:05:00').toISOString(),
        description: 'Pago registrado pendiente de validación',
        performedBy: 'Sistema',
        metadata: {
          paymentId: 'pay-007',
          amount: 640,
          paymentMethod: 'OXXO',
          buyerName: 'Pedro Torres'
        }
      },
      {
        eventId: 'evt-008',
        raffleId: raffleId,
        eventType: 'payment_validated',
        timestamp: new Date('2024-01-09T14:30:00').toISOString(),
        description: 'Pago validado correctamente',
        performedBy: 'Admin Usuario',
        metadata: {
          paymentId: 'pay-007',
          amount: 640,
          ticketNumbers: ['070', '071', '072', '073', '074', '075', '076', '077']
        }
      },
      {
        eventId: 'evt-009',
        raffleId: raffleId,
        eventType: 'tickets_reserved',
        timestamp: new Date('2024-01-10T10:30:00').toISOString(),
        description: 'Boletos reservados por comprador',
        performedBy: 'Sistema',
        metadata: {
          ticketNumbers: ['001', '002', '003'],
          buyerName: 'Juan Pérez García',
          buyerPhone: '5551234567'
        }
      },
      {
        eventId: 'evt-010',
        raffleId: raffleId,
        eventType: 'payment_created',
        timestamp: new Date('2024-01-10T10:35:00').toISOString(),
        description: 'Pago registrado pendiente de validación',
        performedBy: 'Sistema',
        metadata: {
          paymentId: 'pay-001',
          amount: 300,
          paymentMethod: 'Transferencia',
          buyerName: 'Juan Pérez García'
        }
      },
      {
        eventId: 'evt-011',
        raffleId: raffleId,
        eventType: 'tickets_reserved',
        timestamp: new Date('2024-01-10T11:15:00').toISOString(),
        description: 'Boletos reservados por comprador',
        performedBy: 'Sistema',
        metadata: {
          ticketNumbers: ['005', '010', '015', '020', '025'],
          buyerName: 'María González López',
          buyerPhone: '5559876543'
        }
      },
      {
        eventId: 'evt-012',
        raffleId: raffleId,
        eventType: 'payment_created',
        timestamp: new Date('2024-01-10T11:20:00').toISOString(),
        description: 'Pago registrado pendiente de validación',
        performedBy: 'Sistema',
        metadata: {
          paymentId: 'pay-002',
          amount: 450,
          paymentMethod: 'Transferencia',
          buyerName: 'María González López'
        }
      },
      {
        eventId: 'evt-013',
        raffleId: raffleId,
        eventType: 'payment_validated',
        timestamp: new Date('2024-01-10T11:45:00').toISOString(),
        description: 'Pago validado correctamente',
        performedBy: 'Admin Usuario',
        metadata: {
          paymentId: 'pay-002',
          amount: 450,
          ticketNumbers: ['005', '010', '015', '020', '025']
        }
      },
      {
        eventId: 'evt-014',
        raffleId: raffleId,
        eventType: 'tickets_reserved',
        timestamp: new Date('2024-01-10T12:00:00').toISOString(),
        description: 'Boletos reservados por comprador',
        performedBy: 'Sistema',
        metadata: {
          ticketNumbers: ['007'],
          buyerName: 'Carlos Rodríguez',
          buyerPhone: '5552468135'
        }
      },
      {
        eventId: 'evt-015',
        raffleId: raffleId,
        eventType: 'payment_created',
        timestamp: new Date('2024-01-10T12:05:00').toISOString(),
        description: 'Pago registrado pendiente de validación',
        performedBy: 'Sistema',
        metadata: {
          paymentId: 'pay-003',
          amount: 100,
          paymentMethod: 'OXXO',
          buyerName: 'Carlos Rodríguez'
        }
      },
      {
        eventId: 'evt-016',
        raffleId: raffleId,
        eventType: 'payment_rejected',
        timestamp: new Date('2024-01-10T12:30:00').toISOString(),
        description: 'Pago rechazado - Comprobante ilegible',
        performedBy: 'Admin Usuario',
        metadata: {
          paymentId: 'pay-003',
          amount: 100
        }
      },
      {
        eventId: 'evt-017',
        raffleId: raffleId,
        eventType: 'raffle_updated',
        timestamp: new Date('2024-01-10T13:00:00').toISOString(),
        description: 'Información de la rifa actualizada',
        performedBy: 'Admin Usuario',
        metadata: {
          oldStatus: 'active',
          newStatus: 'active'
        }
      },
      {
        eventId: 'evt-018',
        raffleId: raffleId,
        eventType: 'tickets_reserved',
        timestamp: new Date('2024-01-10T14:20:00').toISOString(),
        description: 'Boletos reservados por comprador',
        performedBy: 'Sistema',
        metadata: {
          ticketNumbers: ['030', '031'],
          buyerName: 'Ana Martínez',
          buyerPhone: '5553691470'
        }
      },
      {
        eventId: 'evt-019',
        raffleId: raffleId,
        eventType: 'payment_created',
        timestamp: new Date('2024-01-10T14:25:00').toISOString(),
        description: 'Pago registrado pendiente de validación',
        performedBy: 'Sistema',
        metadata: {
          paymentId: 'pay-004',
          amount: 180,
          paymentMethod: 'Transferencia',
          buyerName: 'Ana Martínez'
        }
      },
      {
        eventId: 'evt-020',
        raffleId: raffleId,
        eventType: 'tickets_reserved',
        timestamp: new Date('2024-01-10T15:00:00').toISOString(),
        description: 'Boletos reservados por comprador',
        performedBy: 'Sistema',
        metadata: {
          ticketNumbers: ['050', '051', '052', '053', '054', '055'],
          buyerName: 'Luis Hernández',
          buyerPhone: '5558523697'
        }
      },
      {
        eventId: 'evt-021',
        raffleId: raffleId,
        eventType: 'payment_created',
        timestamp: new Date('2024-01-10T15:05:00').toISOString(),
        description: 'Pago registrado pendiente de validación',
        performedBy: 'Sistema',
        metadata: {
          paymentId: 'pay-005',
          amount: 540,
          paymentMethod: 'OXXO',
          buyerName: 'Luis Hernández'
        }
      },
      {
        eventId: 'evt-022',
        raffleId: raffleId,
        eventType: 'payment_validated',
        timestamp: new Date('2024-01-10T15:20:00').toISOString(),
        description: 'Pago validado correctamente',
        performedBy: 'Admin Usuario',
        metadata: {
          paymentId: 'pay-005',
          amount: 540,
          ticketNumbers: ['050', '051', '052', '053', '054', '055']
        }
      }
    ];
  }
}