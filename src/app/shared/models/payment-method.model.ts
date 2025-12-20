/**
 * Tipos de pago disponibles
 */
export enum PaymentType {
  BANK_TRANSFER = 'BANK_TRANSFER',           // Transferencia bancaria
  CLABE = 'CLABE',                           // CLABE interbancaria
  DEBIT_CARD = 'DEBIT_CARD',                 // Tarjeta de débito
  CREDIT_CARD = 'CREDIT_CARD',               // Tarjeta de crédito
  CASH = 'CASH',                             // Efectivo / OXXO
  PAYPAL = 'PAYPAL',                         // PayPal
  MERCADO_PAGO = 'MERCADO_PAGO'              // Mercado Pago
}

/**
 * Bancos disponibles en México
 */
export enum Bank {
  BBVA = 'BBVA',
  BANAMEX = 'Banamex',
  SANTANDER = 'Santander',
  BANORTE = 'Banorte',
  HSBC = 'HSBC',
  SCOTIABANK = 'Scotiabank',
  INBURSA = 'Inbursa',
  AFIRME = 'Afirme',
  BANCOPPEL = 'BanCoppel',
  BANREGIO = 'Banregio',
  AZTECA = 'Banco Azteca',
  OTRO = 'Otro'
}

/**
 * Método de pago
 */
export interface PaymentMethod {
  id: string;
  tenantId: string;
  
  // Información básica
  paymentType: PaymentType;
  bank?: Bank;                            // Opcional (no aplica para efectivo, PayPal, etc.)
  isActive: boolean;
  isPrimary: boolean;
  
  // Datos de cuenta (opcionales según tipo)
  accountNumber?: string;                 // Número de cuenta
  clabe?: string;                         // CLABE Interbancaria (18 dígitos)
  cardNumber?: string;                    // Últimos 4 dígitos de tarjeta
  accountHolder?: string;                 // Nombre del titular/beneficiario
  reference?: string;                     // Referencia o concepto
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear método de pago
 */
export interface CreatePaymentMethodDto {
  paymentType: PaymentType;
  bank?: Bank;
  isActive: boolean;
  isPrimary: boolean;
  accountNumber?: string;
  clabe?: string;
  cardNumber?: string;
  accountHolder?: string;
  reference?: string;
}

/**
 * DTO para actualizar método de pago
 */
export interface UpdatePaymentMethodDto {
  paymentType?: PaymentType;
  bank?: Bank;
  isActive?: boolean;
  isPrimary?: boolean;
  accountNumber?: string;
  clabe?: string;
  cardNumber?: string;
  accountHolder?: string;
  reference?: string;
}

/**
 * Logos de bancos (Font Awesome icons)
 */
export const BANK_LOGOS: Record<Bank, string> = {
  [Bank.BBVA]: 'fas fa-university',
  [Bank.BANAMEX]: 'fas fa-landmark',
  [Bank.SANTANDER]: 'fas fa-building-columns',
  [Bank.BANORTE]: 'fas fa-piggy-bank',
  [Bank.HSBC]: 'fas fa-vault',
  [Bank.SCOTIABANK]: 'fas fa-money-check-alt',
  [Bank.INBURSA]: 'fas fa-hand-holding-usd',
  [Bank.AFIRME]: 'fas fa-coins',
  [Bank.BANCOPPEL]: 'fas fa-wallet',
  [Bank.BANREGIO]: 'fas fa-chart-line',
  [Bank.AZTECA]: 'fas fa-store',
  [Bank.OTRO]: 'fas fa-university'
};

/**
 * Información de banco con logo
 */
export interface BankInfo {
  code: Bank;
  name: string;
  logo: string;
}

/**
 * Catálogo de bancos con logos (Font Awesome)
 */
export const BANKS_CATALOG: BankInfo[] = [
  { code: Bank.BBVA, name: 'BBVA', logo: 'fas fa-university' },
  { code: Bank.BANAMEX, name: 'Citibanamex', logo: 'fas fa-landmark' },
  { code: Bank.SANTANDER, name: 'Santander', logo: 'fas fa-building-columns' },
  { code: Bank.BANORTE, name: 'Banorte', logo: 'fas fa-piggy-bank' },
  { code: Bank.HSBC, name: 'HSBC', logo: 'fas fa-vault' },
  { code: Bank.SCOTIABANK, name: 'Scotiabank', logo: 'fas fa-money-check-alt' },
  { code: Bank.INBURSA, name: 'Inbursa', logo: 'fas fa-hand-holding-usd' },
  { code: Bank.AFIRME, name: 'Afirme', logo: 'fas fa-coins' },
  { code: Bank.BANCOPPEL, name: 'BanCoppel', logo: 'fas fa-wallet' },
  { code: Bank.BANREGIO, name: 'Banregio', logo: 'fas fa-chart-line' },
  { code: Bank.AZTECA, name: 'Banco Azteca', logo: 'fas fa-store' },
  { code: Bank.OTRO, name: 'Otro', logo: 'fas fa-university' }
];