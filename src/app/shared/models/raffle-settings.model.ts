/**
 * Configuración general de rifas
 */
export interface RaffleSettings {
  tenantId: string;
  
  // General Config
  minutesToCloseRaffle: number;           // Default: 60
  enableLuckyMachine: boolean;            // Default: true
  luckyMachineOptions: number[];          // Ej: [1, 5, 10, 20, 100]
  
  // Ticket Settings
  ticketsPerPage: number;                 // Default: 50
  minTicketPrice: number;                 // Default: 10
  maxTicketPrice: number;                 // Default: 10000
  allowReservations: boolean;             // Default: true
  maxReservationTime: number;             // Minutos, default: 30
  
  // Timing Settings
  reservationTime: number;                // Minutos de apartado, default: 30
  autoReleaseUnpaidTickets: boolean;      // Default: true
  autoReminders: boolean;                 // Default: true
  reminderIntervals: number[];            // Minutos antes del vencimiento: [15, 30, 60]
  
  // Metadata
  updatedAt: Date;
  updatedBy?: string;
}

/**
 * DTO para actualizar configuración
 */
export interface UpdateRaffleSettingsDto {
  minutesToCloseRaffle?: number;
  enableLuckyMachine?: boolean;
  luckyMachineOptions?: number[];
  ticketsPerPage?: number;
  minTicketPrice?: number;
  maxTicketPrice?: number;
  allowReservations?: boolean;
  maxReservationTime?: number;
  reservationTime?: number;
  autoReleaseUnpaidTickets?: boolean;
  autoReminders?: boolean;
  reminderIntervals?: number[];
}

/**
 * Valores por defecto
 */
export const DEFAULT_RAFFLE_SETTINGS: Partial<RaffleSettings> = {
  minutesToCloseRaffle: 60,
  enableLuckyMachine: true,
  luckyMachineOptions: [1, 5, 10, 20, 100],
  ticketsPerPage: 50,
  minTicketPrice: 10,
  maxTicketPrice: 10000,
  allowReservations: true,
  maxReservationTime: 30,
  reservationTime: 30,
  autoReleaseUnpaidTickets: true,
  autoReminders: true,
  reminderIntervals: [15, 30, 60]
};