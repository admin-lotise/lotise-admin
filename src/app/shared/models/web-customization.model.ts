/**
 * Configuración de personalización web
 */
export interface WebCustomization {
  tenantId: string;
  
  // Colores
  primaryColor: string;                   // Hex color, ej: #ff497c
  primaryContrast: string;                // Hex color, ej: #ffffff
  secondaryColor: string;                 // Hex color, ej: #3b82f6
  secondaryContrast: string;              // Hex color, ej: #ffffff
  
  // Imágenes
  logoUrl?: string;                       // URL del logo
  faviconUrl?: string;                    // URL del favicon
  backgroundImageUrl?: string;            // URL de imagen de fondo (opcional)
  
  // Funcionalidades (checkboxes)
  showTicketVerifier: boolean;            // Mostrar verificador de boletos
  showParticipantsList: boolean;          // Mostrar lista de participantes
  showTimer: boolean;                     // Mostrar temporizador
  showSoldTickets: boolean;               // Mostrar boletos vendidos
  showPrivacyPolicy: boolean;             // Mostrar aviso de privacidad
  showTermsConditions: boolean;           // Mostrar términos y condiciones
  openWhatsAppDirect: boolean;            // Abrir WhatsApp directo
  allowSocialShare: boolean;              // Permitir compartir en redes
  showPreviousWinners: boolean;           // Mostrar ganadores anteriores
  
  // Metadata
  updatedAt: Date;
  updatedBy?: string;
}

/**
 * DTO para actualizar personalización
 */
export interface UpdateWebCustomizationDto {
  primaryColor?: string;
  primaryContrast?: string;
  secondaryColor?: string;
  secondaryContrast?: string;
  logoUrl?: string;
  faviconUrl?: string;
  backgroundImageUrl?: string;
  showTicketVerifier?: boolean;
  showParticipantsList?: boolean;
  showTimer?: boolean;
  showSoldTickets?: boolean;
  showPrivacyPolicy?: boolean;
  showTermsConditions?: boolean;
  openWhatsAppDirect?: boolean;
  allowSocialShare?: boolean;
  showPreviousWinners?: boolean;
}

/**
 * Valores por defecto
 */
export const DEFAULT_WEB_CUSTOMIZATION: Partial<WebCustomization> = {
  primaryColor: '#ff497c',
  primaryContrast: '#ffffff',
  secondaryColor: '#3b82f6',
  secondaryContrast: '#ffffff',
  showTicketVerifier: true,
  showParticipantsList: true,
  showTimer: true,
  showSoldTickets: true,
  showPrivacyPolicy: true,
  showTermsConditions: true,
  openWhatsAppDirect: true,
  allowSocialShare: true,
  showPreviousWinners: true
};