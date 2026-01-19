/**
 * Modelo principal de configuración del tenant
 */
export interface TenantSettings {
  tenantId: string;
  businessProfile: BusinessProfile;
  bioPage: BioPage;  // 🆕 NUEVO
  raffleConfig?: RaffleConfig;
  communication?: Communication;
  paymentMethods?: PaymentMethod[];
  legal?: Legal;
  createdAt: string;
  updatedAt: string;
}

// ==================== BUSINESS PROFILE ====================

/**
 * Perfil del negocio
 */
export interface BusinessProfile {
  businessName: string;
  aboutUs: string;
  logoUrl: string | null;
  whatsappContacts: WhatsAppContact[];
  socialMedia: SocialMedia;
  contactInfo?: ContactInfo;
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
 * Información de contacto general del negocio
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  scheduleText?: string;
}

// ==================== BIO PAGE ====================

/**
 * Configuración de Bio Page (Landing Page personalizada)
 */
export interface BioPage {
  tenantId: string;
  
  // PERFIL (usa datos de BusinessProfile)
  // displayName → businessName
  // bio → aboutUs (primeros 150 caracteres)
  // photoUrl → logoUrl
  
  // SECCIONES
  howItWorks: HowItWorksSection;
  testimonials: TestimonialsSection;
  faqs: FaqsSection;
  contact: ContactSection;
  
  // APARIENCIA (sincronizado con web-customization)
  backgroundColor: string;
  buttonColor: string;
  buttonStyle: ButtonStyle;
  
  // LINKS ADICIONALES
  links: BioLink[];
  
  // METADATA
  updatedAt: Date;
  updatedBy?: string;
}

// ==================== SECCIÓN: CÓMO FUNCIONA ====================

export interface HowItWorksSection {
  enabled: boolean;
  title: string;
  subtitle?: string;
  steps: HowItWorksStep[];
}

export interface HowItWorksStep {
  id: string;
  order: number;
  icon: string;
  title: string;
  description: string;
}

// ==================== SECCIÓN: TESTIMONIOS ====================

export interface TestimonialsSection {
  enabled: boolean;
  title: string;
  subtitle?: string;
  items: Testimonial[];
}

export interface Testimonial {
  id: string;
  order: number;
  name: string;
  message: string;
  rating: number;
  avatarUrl?: string;
  prize?: string;
  date?: Date;
}

// ==================== SECCIÓN: PREGUNTAS FRECUENTES ====================

export interface FaqsSection {
  enabled: boolean;
  title: string;
  subtitle?: string;
  items: FaqItem[];
}

export interface FaqItem {
  id: string;
  order: number;
  question: string;
  answer: string;
  category?: FaqCategory;
}

export enum FaqCategory {
  GENERAL = 'GENERAL',
  RAFFLES = 'RAFFLES',
  PAYMENTS = 'PAYMENTS',
  TICKETS = 'TICKETS',
  WINNERS = 'WINNERS',
  ACCOUNT = 'ACCOUNT'
}

// ==================== SECCIÓN: CONTACTO ====================

export interface ContactSection {
  enabled: boolean;
  title: string;
  subtitle?: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  address?: string;
  scheduleText?: string;
}

// ==================== BIO LINKS ====================

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

// ==================== ESTILOS ====================

export enum ButtonStyle {
  SQUARE = 'SQUARE',
  ROUNDED = 'ROUNDED',
  PILL = 'PILL'
}

// ==================== BIO PAGE DTOs ====================

export interface UpdateBioPageDto {
  howItWorks?: HowItWorksSection;
  testimonials?: TestimonialsSection;
  faqs?: FaqsSection;
  contact?: ContactSection;
  backgroundColor?: string;
  buttonColor?: string;
  buttonStyle?: ButtonStyle;
}

export interface CreateHowItWorksStepDto {
  order: number;
  icon: string;
  title: string;
  description: string;
}

export interface UpdateHowItWorksStepDto {
  order?: number;
  icon?: string;
  title?: string;
  description?: string;
}

export interface CreateTestimonialDto {
  order: number;
  name: string;
  message: string;
  rating: number;
  avatarUrl?: string;
  prize?: string;
  date?: Date;
}

export interface UpdateTestimonialDto {
  order?: number;
  name?: string;
  message?: string;
  rating?: number;
  avatarUrl?: string;
  prize?: string;
  date?: Date;
}

export interface CreateFaqDto {
  order: number;
  question: string;
  answer: string;
  category?: FaqCategory;
}

export interface UpdateFaqDto {
  order?: number;
  question?: string;
  answer?: string;
  category?: FaqCategory;
}

export interface UpdateContactSectionDto {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  address?: string;
  scheduleText?: string;
}

export interface CreateBioLinkDto {
  title: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface UpdateBioLinkDto {
  title?: string;
  url?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

// ==================== VALORES POR DEFECTO ====================

export const DEFAULT_BIO_PAGE: Partial<BioPage> = {
  howItWorks: {
    enabled: true,
    title: '¿Cómo Funciona?',
    subtitle: 'Ganar es muy fácil, solo sigue estos pasos',
    steps: [
      {
        id: '1',
        order: 1,
        icon: 'fas fa-search',
        title: 'Elige tu Rifa',
        description: 'Explora nuestras rifas activas y elige la que más te guste'
      },
      {
        id: '2',
        order: 2,
        icon: 'fas fa-ticket-alt',
        title: 'Compra tus Boletos',
        description: 'Selecciona tus números de la suerte y realiza tu pago'
      },
      {
        id: '3',
        order: 3,
        icon: 'fas fa-trophy',
        title: 'Espera el Sorteo',
        description: 'En la fecha programada se realizará el sorteo y anunciaremos al ganador'
      }
    ]
  },
  testimonials: {
    enabled: true,
    title: 'Lo que Dicen Nuestros Ganadores',
    subtitle: 'Testimonios reales de clientes satisfechos',
    items: []
  },
  faqs: {
    enabled: true,
    title: 'Preguntas Frecuentes',
    subtitle: 'Resuelve tus dudas',
    items: [
      {
        id: '1',
        order: 1,
        question: '¿Cómo compro boletos?',
        answer: 'Selecciona la rifa de tu preferencia, elige tus números y realiza el pago mediante transferencia bancaria.',
        category: FaqCategory.RAFFLES
      },
      {
        id: '2',
        order: 2,
        question: '¿Cuándo se realiza el sorteo?',
        answer: 'Cada rifa tiene una fecha de sorteo específica. La encontrarás en la descripción de la rifa.',
        category: FaqCategory.RAFFLES
      },
      {
        id: '3',
        order: 3,
        question: '¿Cómo sé si gané?',
        answer: 'Te notificaremos por WhatsApp y podrás verificar en la sección de ganadores de nuestro sitio.',
        category: FaqCategory.WINNERS
      }
    ]
  },
  contact: {
    enabled: true,
    title: 'Contáctanos',
    subtitle: 'Estamos aquí para ayudarte',
    scheduleText: 'Lun-Vie 9:00am - 6:00pm'
  },
  backgroundColor: '#ffffff',
  buttonColor: '#ff497c',
  buttonStyle: ButtonStyle.ROUNDED,
  links: []
};

// ==================== OTRAS CONFIGURACIONES (YA EXISTENTES) ====================

export interface RaffleConfig {
  minutesToClose: number;
  ticketsPerPage: number;
  luckyMachineOptions: string;
  webPageConfig: WebPageConfig;
}

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

export interface Communication {
  whatsappTemplates: WhatsAppTemplates;
  faq: FAQ[];
}

export interface WhatsAppTemplates {
  ticketPurchase: string;
  paymentReminder: string;
  paymentProof: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt?: string;
}

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

export type PaymentType = 
  | 'DEPOSITO_OXXO'
  | 'DEPOSITO_OXXO_EFECTIVO'
  | 'DEPOSITO_EFECTIVO'
  | 'DEPOSITO_TRANSFERENCIA'
  | 'TRANSFERENCIA';

export interface Legal {
  privacyPolicy: string;
  termsAndConditions: string;
  winners: Winner[];
}

export interface Winner {
  id: string;
  raffleName: string;
  winnerName: string;
  prize: string;
  date: string;
  imageUrl?: string;
}

export interface FileUploadRequest {
  file: File;
  tenantId: string;
  fileType: 'logo' | 'winner-image' | 'avatar' | 'other';
}

export interface FileUploadResponse {
  success: boolean;
  url: string;
  message?: string;
}