export type RaffleTab = 'overview' | 'participants' | 'tickets' | 'payments' | 'history';

export interface TabItem {
  id: RaffleTab;
  label: string;
  icon: string;
  disabled?: boolean;
}

export const RAFFLE_TABS: TabItem[] = [
  { id: 'overview', label: 'Información', icon: 'fa-info-circle' },
  { id: 'participants', label: 'Participantes', icon: 'fa-users' },
  { id: 'tickets', label: 'Boletos', icon: 'fa-ticket-alt' },
  { id: 'payments', label: 'Pagos', icon: 'fa-credit-card' },
  { id: 'history', label: 'Historial', icon: 'fa-history' }
];

export interface RaffleStats {
  totalTickets: number;
  soldTickets: number;
  availableTickets: number;
  revenue: number;
  participants: number;
  daysRemaining: number;
}