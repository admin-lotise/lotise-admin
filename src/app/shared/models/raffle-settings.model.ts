/**
 * Configuración de página web (apariencia y funcionalidades)
 */
export interface WebPageConfig {
  // Elementos visibles
  showVerifier: boolean;
  showParticipants: boolean;
  showTimer: boolean;
  showPrivacyPolicy: boolean;
  showTerms: boolean;
  showTicketsSold: boolean;
  openWhatsAppDirect: boolean;
  
  // Colores
  primaryColor: string;
  primaryColorContrast: string;
  secondaryColor: string;
  secondaryColorContrast: string;
}

/**
 * Configuración general de rifas
 */
export interface RaffleSettings {
  tenantId: string;
  
  // General Config
  minutesToClose: number;                 // Minutos para cerrar antes del sorteo
  ticketsPerPage: number;                 // Boletos por página
  luckyMachineOptions: string;            // Opciones separadas por comas: "1,2,3,4,5"
  
  // Web Page Config
  webPageConfig: WebPageConfig;
  
  // Metadata
  updatedAt: Date;
  updatedBy?: string;
}

/**
 * DTO para actualizar configuración general
 */
export interface UpdateGeneralSettingsDto {
  minutesToClose: number;
  ticketsPerPage: number;
  luckyMachineOptions: string;
}

/**
 * DTO para actualizar configuración de página web
 */
export interface UpdateWebPageConfigDto {
  showVerifier?: boolean;
  showParticipants?: boolean;
  showTimer?: boolean;
  showPrivacyPolicy?: boolean;
  showTerms?: boolean;
  showTicketsSold?: boolean;
  openWhatsAppDirect?: boolean;
  primaryColor?: string;
  primaryColorContrast?: string;
  secondaryColor?: string;
  secondaryColorContrast?: string;
}

/**
 * DTO para actualizar configuración completa
 */
export interface UpdateRaffleSettingsDto {
  minutesToClose?: number;
  ticketsPerPage?: number;
  luckyMachineOptions?: string;
  webPageConfig?: UpdateWebPageConfigDto;
}

/**
 * Valores por defecto
 */
export const DEFAULT_RAFFLE_SETTINGS: Partial<RaffleSettings> = {
  minutesToClose: 30,
  ticketsPerPage: 50,
  luckyMachineOptions: '1,2,3,4,5,6,7,8,9,10',
  webPageConfig: {
    showVerifier: true,
    showParticipants: true,
    showTimer: true,
    showPrivacyPolicy: false,
    showTerms: false,
    showTicketsSold: true,
    openWhatsAppDirect: false,
    primaryColor: '#ff497c',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#3b82f6',
    secondaryColorContrast: '#ffffff'
  }
};