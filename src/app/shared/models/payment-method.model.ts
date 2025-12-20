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
 * Bancos disponibles en México (COMPLETO)
 */
export enum Bank {
  // Principales
  BBVA = 'BBVA',
  BANAMEX = 'Banamex',
  SANTANDER = 'Santander',
  BANORTE = 'Banorte',
  HSBC = 'HSBC',
  SCOTIABANK = 'Scotiabank',
  INBURSA = 'Inbursa',
  
  // Digitales/Fintech
  NU = 'Nu',
  KLAR = 'Klar',
  ALBO = 'Albo',
  UALA = 'Ualá',
  HEY_BANCO = 'Hey Banco',
  
  // Regionales
  AFIRME = 'Afirme',
  BANCOPPEL = 'BanCoppel',
  BANREGIO = 'Banregio',
  AZTECA = 'Banco Azteca',
  MULTIVA = 'Multiva',
  INVEX = 'Invex',
  MIFEL = 'Mifel',
  BANBAJIO = 'BanBajío',
  FAMSA = 'Banco Famsa',
  BANSI = 'Bansi',
  
  // Gubernamentales
  BANCOMEXT = 'Bancomext',
  BANOBRAS = 'Banobras',
  BANJERCITO = 'Banjercito',
  
  // Otros
  COMPARTAMOS = 'Compartamos',
  BANCO_BASE = 'Banco Base',
  ACTINVER = 'Actinver',
  BANKAOOL = 'Bankaool',
  FORJADORES = 'Forjadores',
  INMOBILIARIO = 'Inmobiliario',
  MONEX = 'Monex',
  GBM = 'GBM',
  INTERCAM = 'Intercam',
  ABC_CAPITAL = 'ABC Capital',
  UBS = 'UBS',
  JP_MORGAN = 'JP Morgan',
  BARCLAYS = 'Barclays',
  CREDIT_SUISSE = 'Credit Suisse',
  MUFG = 'MUFG',
  MIZUHO = 'Mizuho',
  BNP_PARIBAS = 'BNP Paribas',
  ING = 'ING',
  SABADELL = 'Sabadell',
  SHINHAN = 'Shinhan',
  BANK_OF_AMERICA = 'Bank of America',
  BANK_OF_CHINA = 'Bank of China',
  CONSUBANCO = 'Consubanco',
  VOLKSWAGEN = 'Volkswagen Bank',
  CIBANCO = 'CIBanco',
  DONDE = 'Dondé',
  BANCREA = 'Bancrea',
  PROGRESO = 'Progreso',
  AUTOFIN = 'Autofin',
  PAGATODO = 'PagaTodo',
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
  bank?: Bank;
  isActive: boolean;
  isPrimary: boolean;
  
  // Datos de cuenta (opcionales según tipo)
  accountNumber?: string;
  clabe?: string;
  cardNumber?: string;
  accountHolder?: string;
  reference?: string;
  
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
 * Información de banco con logo
 */
export interface BankInfo {
  code: Bank;
  name: string;
  logo: string;
  category: 'principal' | 'digital' | 'regional' | 'gubernamental' | 'otro';
}

/**
 * Catálogo COMPLETO de bancos en México (ordenado por categoría)
 */
export const BANKS_CATALOG: BankInfo[] = [
  // ==================== PRINCIPALES ====================
  { code: Bank.BBVA, name: 'BBVA México', logo: 'fas fa-university', category: 'principal' },
  { code: Bank.BANAMEX, name: 'Citibanamex', logo: 'fas fa-landmark', category: 'principal' },
  { code: Bank.SANTANDER, name: 'Santander', logo: 'fas fa-building-columns', category: 'principal' },
  { code: Bank.BANORTE, name: 'Banorte', logo: 'fas fa-piggy-bank', category: 'principal' },
  { code: Bank.HSBC, name: 'HSBC México', logo: 'fas fa-vault', category: 'principal' },
  { code: Bank.SCOTIABANK, name: 'Scotiabank', logo: 'fas fa-money-check-alt', category: 'principal' },
  { code: Bank.INBURSA, name: 'Inbursa', logo: 'fas fa-hand-holding-usd', category: 'principal' },
  
  // ==================== DIGITALES / FINTECH ====================
  { code: Bank.NU, name: 'Nu México', logo: 'fas fa-mobile-alt', category: 'digital' },
  { code: Bank.KLAR, name: 'Klar', logo: 'fas fa-credit-card', category: 'digital' },
  { code: Bank.ALBO, name: 'Albo', logo: 'fas fa-wallet', category: 'digital' },
  { code: Bank.UALA, name: 'Ualá', logo: 'fas fa-mobile-screen', category: 'digital' },
  { code: Bank.HEY_BANCO, name: 'Hey Banco', logo: 'fas fa-robot', category: 'digital' },
  
  // ==================== REGIONALES ====================
  { code: Bank.AFIRME, name: 'Afirme', logo: 'fas fa-coins', category: 'regional' },
  { code: Bank.BANCOPPEL, name: 'BanCoppel', logo: 'fas fa-store', category: 'regional' },
  { code: Bank.BANREGIO, name: 'Banregio', logo: 'fas fa-chart-line', category: 'regional' },
  { code: Bank.AZTECA, name: 'Banco Azteca', logo: 'fas fa-building', category: 'regional' },
  { code: Bank.MULTIVA, name: 'Multiva', logo: 'fas fa-briefcase', category: 'regional' },
  { code: Bank.INVEX, name: 'Invex', logo: 'fas fa-chart-bar', category: 'regional' },
  { code: Bank.MIFEL, name: 'Mifel', logo: 'fas fa-hand-holding-dollar', category: 'regional' },
  { code: Bank.BANBAJIO, name: 'BanBajío', logo: 'fas fa-wheat-awn', category: 'regional' },
  { code: Bank.FAMSA, name: 'Banco Famsa', logo: 'fas fa-house', category: 'regional' },
  { code: Bank.BANSI, name: 'Bansi', logo: 'fas fa-circle-dollar-to-slot', category: 'regional' },
  
  // ==================== GUBERNAMENTALES ====================
  { code: Bank.BANCOMEXT, name: 'Bancomext', logo: 'fas fa-globe', category: 'gubernamental' },
  { code: Bank.BANOBRAS, name: 'Banobras', logo: 'fas fa-hard-hat', category: 'gubernamental' },
  { code: Bank.BANJERCITO, name: 'Banjercito', logo: 'fas fa-shield-halved', category: 'gubernamental' },
  
  // ==================== OTROS ====================
  { code: Bank.COMPARTAMOS, name: 'Compartamos', logo: 'fas fa-handshake', category: 'otro' },
  { code: Bank.BANCO_BASE, name: 'Banco Base', logo: 'fas fa-cube', category: 'otro' },
  { code: Bank.ACTINVER, name: 'Actinver', logo: 'fas fa-chart-gantt', category: 'otro' },
  { code: Bank.BANKAOOL, name: 'Bankaool', logo: 'fas fa-lightbulb', category: 'otro' },
  { code: Bank.FORJADORES, name: 'Forjadores', logo: 'fas fa-hammer', category: 'otro' },
  { code: Bank.INMOBILIARIO, name: 'Inmobiliario', logo: 'fas fa-building-circle-check', category: 'otro' },
  { code: Bank.MONEX, name: 'Monex', logo: 'fas fa-dollar-sign', category: 'otro' },
  { code: Bank.GBM, name: 'GBM', logo: 'fas fa-money-bill-trend-up', category: 'otro' },
  { code: Bank.INTERCAM, name: 'Intercam', logo: 'fas fa-arrows-spin', category: 'otro' },
  { code: Bank.ABC_CAPITAL, name: 'ABC Capital', logo: 'fas fa-a', category: 'otro' },
  { code: Bank.UBS, name: 'UBS', logo: 'fas fa-square-u', category: 'otro' },
  { code: Bank.JP_MORGAN, name: 'JP Morgan', logo: 'fas fa-landmark-dome', category: 'otro' },
  { code: Bank.BARCLAYS, name: 'Barclays', logo: 'fas fa-b', category: 'otro' },
  { code: Bank.CREDIT_SUISSE, name: 'Credit Suisse', logo: 'fas fa-mountain', category: 'otro' },
  { code: Bank.MUFG, name: 'MUFG', logo: 'fas fa-torii-gate', category: 'otro' },
  { code: Bank.MIZUHO, name: 'Mizuho', logo: 'fas fa-yen-sign', category: 'otro' },
  { code: Bank.BNP_PARIBAS, name: 'BNP Paribas', logo: 'fas fa-tower-observation', category: 'otro' },
  { code: Bank.ING, name: 'ING', logo: 'fas fa-i', category: 'otro' },
  { code: Bank.SABADELL, name: 'Sabadell', logo: 'fas fa-s', category: 'otro' },
  { code: Bank.SHINHAN, name: 'Shinhan', logo: 'fas fa-won-sign', category: 'otro' },
  { code: Bank.BANK_OF_AMERICA, name: 'Bank of America', logo: 'fas fa-flag-usa', category: 'otro' },
  { code: Bank.BANK_OF_CHINA, name: 'Bank of China', logo: 'fas fa-flag', category: 'otro' },
  { code: Bank.CONSUBANCO, name: 'Consubanco', logo: 'fas fa-c', category: 'otro' },
  { code: Bank.VOLKSWAGEN, name: 'Volkswagen Bank', logo: 'fas fa-car', category: 'otro' },
  { code: Bank.CIBANCO, name: 'CIBanco', logo: 'fas fa-c', category: 'otro' },
  { code: Bank.DONDE, name: 'Dondé', logo: 'fas fa-d', category: 'otro' },
  { code: Bank.BANCREA, name: 'Bancrea', logo: 'fas fa-circle-nodes', category: 'otro' },
  { code: Bank.PROGRESO, name: 'Progreso', logo: 'fas fa-arrow-trend-up', category: 'otro' },
  { code: Bank.AUTOFIN, name: 'Autofin', logo: 'fas fa-car-side', category: 'otro' },
  { code: Bank.PAGATODO, name: 'PagaTodo', logo: 'fas fa-receipt', category: 'otro' },
  { code: Bank.OTRO, name: 'Otro', logo: 'fas fa-university', category: 'otro' }
];

/**
 * Logos de bancos (Font Awesome icons) - para retrocompatibilidad
 */
export const BANK_LOGOS: Record<Bank, string> = BANKS_CATALOG.reduce((acc, bank) => {
  acc[bank.code] = bank.logo;
  return acc;
}, {} as Record<Bank, string>);