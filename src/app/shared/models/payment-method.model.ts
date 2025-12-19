/**
 * Tipos de pago disponibles
 */
export enum PaymentType {
  DEPOSITO_OXXO = 'DEPOSITO_OXXO',
  DEPOSITO_OXXO_EFECTIVO = 'DEPOSITO_OXXO_EFECTIVO',
  DEPOSITO_EFECTIVO = 'DEPOSITO_EFECTIVO',
  DEPOSITO_TRANSFERENCIA = 'DEPOSITO_TRANSFERENCIA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TARJETA = 'TARJETA'
}

/**
 * Bancos disponibles en México
 */
export enum Bank {
  BANCOPPEL = 'BanCoppel',
  BANORTE = 'Banorte',
  HSBC = 'HSBC',
  BBVA = 'BBVA',
  SANTANDER = 'Santander',
  AFIRME = 'Afirme',
  SCOTIABANK = 'Scotiabank',
  BANAMEX = 'Banamex',
  INBURSA = 'Inbursa',
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
  bank: Bank;
  isActive: boolean;
  isPrimary: boolean;                     // Método principal
  
  // Datos de cuenta (opcionales según tipo)
  accountNumber?: string;                 // Número de cuenta
  cardNumber?: string;                    // Últimos 4 dígitos
  clabe?: string;                         // CLABE Interbancaria
  beneficiary?: string;                   // Nombre del beneficiario
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
  bank: Bank;
  isActive: boolean;
  isPrimary: boolean;
  accountNumber?: string;
  cardNumber?: string;
  clabe?: string;
  beneficiary?: string;
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
  cardNumber?: string;
  clabe?: string;
  beneficiary?: string;
  reference?: string;
}

/**
 * Información de banco con logo
 */
export interface BankInfo {
  code: Bank;
  name: string;
  logo?: string;  // URL del logo
}

/**
 * Catálogo de bancos con logos
 */
export const BANKS_CATALOG: BankInfo[] = [
  { code: Bank.BBVA, name: 'BBVA', logo: 'assets/banks/bbva.svg' },
  { code: Bank.BANAMEX, name: 'Citibanamex', logo: 'assets/banks/banamex.svg' },
  { code: Bank.SANTANDER, name: 'Santander', logo: 'assets/banks/santander.svg' },
  { code: Bank.BANORTE, name: 'Banorte', logo: 'assets/banks/banorte.svg' },
  { code: Bank.HSBC, name: 'HSBC', logo: 'assets/banks/hsbc.svg' },
  { code: Bank.SCOTIABANK, name: 'Scotiabank', logo: 'assets/banks/scotiabank.svg' },
  { code: Bank.INBURSA, name: 'Inbursa', logo: 'assets/banks/inbursa.svg' },
  { code: Bank.AFIRME, name: 'Afirme', logo: 'assets/banks/afirme.svg' },
  { code: Bank.BANCOPPEL, name: 'BanCoppel', logo: 'assets/banks/bancoppel.svg' },
  { code: Bank.BANREGIO, name: 'Banregio', logo: 'assets/banks/banregio.svg' },
  { code: Bank.AZTECA, name: 'Banco Azteca', logo: 'assets/banks/azteca.svg' },
  { code: Bank.OTRO, name: 'Otro', logo: 'assets/banks/default.svg' }
];