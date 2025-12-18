/**
 * Modelo principal de configuración del tenant
 */
export interface TenantSettings {
  tenantId: string;
  businessProfile: BusinessProfile;
  raffleConfig?: RaffleConfig;
  communication?: Communication;
  paymentMethods?: PaymentMethod[];
  legal?: Legal;
  createdAt: string;
  updatedAt: string;
}

/**
 * Perfil del negocio
 */
export interface BusinessProfile {
  businessName: string;
  aboutUs: string;
  logoUrl: string | null;
  whatsappContacts: WhatsAppContact[];
  socialMedia: SocialMedia;
}

/**
 * Contacto de WhatsApp
 */
export interface WhatsAppContact {
  id: string;
  countryCode: string;
  number: string;
  useForReservations: boolean;
  visibleOnWeb: boolean;
  createdAt?: string;
}

/**
 * Redes sociales
 */
export interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  tiktok: string;
}

/**
 * Configuración de rifas (para futuro)
 */
export interface RaffleConfig {
  minutesToClose: number;
  ticketsPerPage: number;
  luckyMachineOptions: string;
  webPageConfig: WebPageConfig;
}

/**
 * Configuración de página web (para futuro)
 */
export interface WebPageConfig {
  showVerifier: boolean;
  showParticipants: boolean;
  showTimer: boolean;
  showPrivacyPolicy: boolean;
  showTerms: boolean;
  showTicketsSold: boolean;
  openWhatsAppDirect: boolean;
  primaryColor: string;
  primaryColorContrast: string;
  secondaryColor: string;
  secondaryColorContrast: string;
}

/**
 * Comunicación (para futuro)
 */
export interface Communication {
  whatsappTemplates: WhatsAppTemplates;
  faq: FAQ[];
}

/**
 * Templates de WhatsApp (para futuro)
 */
export interface WhatsAppTemplates {
  ticketPurchase: string;
  paymentReminder: string;
  paymentProof: string;
}

/**
 * Preguntas frecuentes (para futuro)
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt?: string;
}

/**
 * Método de pago (para futuro)
 */
export interface PaymentMethod {
  id: string;
  paymentType: PaymentType;
  bankName: string;
  accountNumber?: string;
  cardNumber?: string;
  clabe?: string;
  beneficiary?: string;
  reference?: string;
  createdAt?: string;
}

/**
 * Tipos de pago disponibles
 */
export type PaymentType = 
  | 'DEPOSITO_OXXO'
  | 'DEPOSITO_OXXO_EFECTIVO'
  | 'DEPOSITO_EFECTIVO'
  | 'DEPOSITO_TRANSFERENCIA'
  | 'TRANSFERENCIA';

/**
 * Documentos legales (para futuro)
 */
export interface Legal {
  privacyPolicy: string;
  termsAndConditions: string;
  winners: Winner[];
}

/**
 * Ganador (para futuro)
 */
export interface Winner {
  id: string;
  raffleName: string;
  winnerName: string;
  prize: string;
  date: string;
  imageUrl?: string;
}

/**
 * DTO para subir archivos
 */
export interface FileUploadRequest {
  file: File;
  tenantId: string;
  fileType: 'logo' | 'winner-image' | 'other';
}

/**
 * Respuesta de subida de archivo
 */
export interface FileUploadResponse {
  success: boolean;
  url: string;
  message?: string;
}