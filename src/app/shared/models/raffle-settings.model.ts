/**
 * Configuración de página web (apariencia y funcionalidades)
 */
export interface WebPageConfig {
  // ==================== ELEMENTOS VISIBLES ====================
  // Página de Rifa Individual
  showVerifier: boolean;                // Verificador de boletos
  showParticipants: boolean;            // Lista de participantes
  showTimer: boolean;                   // Contador regresivo
  showTicketsSold: boolean;             // Boletos vendidos
  showPrivacyPolicy: boolean;           // Link a política de privacidad
  showTerms: boolean;                   // Link a términos y condiciones
  openWhatsAppDirect: boolean;          // Abrir WhatsApp directo
  
  // Landing Page / Home
  showPreviousWinners: boolean;         // Mostrar últimos ganadores
  allowSocialShare: boolean;            // Permitir compartir en redes
  
  // ==================== COLORES ====================
  primaryColor: string;                 // Color primario (#ff497c)
  primaryColorContrast: string;         // Contraste primario (#ffffff)
  secondaryColor: string;               // Color secundario (#10b981)
  secondaryColorContrast: string;       // Contraste secundario (#ffffff)
  darkMode: boolean;                    // Modo oscuro
  selectedTheme?: string;               // Tema predefinido (para planes premium)
  
  // ==================== BRANDING ====================
  logoUrl?: string;                     // Logo del negocio
  faviconUrl?: string;                  // Favicon del sitio
  heroBackgroundUrl?: string;           // Imagen de fondo del hero
  
  // ==================== REDES SOCIALES ====================
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
  };
  
  // ==================== CONTENIDO ====================
  heroTitle?: string;                   // Título del hero
  heroSubtitle?: string;                // Subtítulo del hero
  footerText?: string;                  // Texto del footer
}

/**
 * Configuración general de rifas
 */
export interface RaffleSettings {
  id?: string;
  tenantId: string;
  
  // ==================== GENERAL CONFIG ====================
  minutesToClose: number;               // Minutos antes del sorteo para cerrar
  ticketsPerPage: number;               // Boletos por página
  luckyMachineOptions: string;          // Opciones de máquina de la suerte
  
  // ==================== WEB PAGE CONFIG ====================
  webPageConfig: WebPageConfig;
  
  // ==================== METADATA ====================
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}

// ==================== DTOs ====================

/**
 * DTO para actualizar configuración general
 */
export interface UpdateGeneralSettingsDto {
  minutesToClose?: number;
  ticketsPerPage?: number;
  luckyMachineOptions?: string;
}

/**
 * DTO para actualizar configuración de página web
 */
export interface UpdateWebPageConfigDto {
  // Elementos visibles
  showVerifier?: boolean;
  showParticipants?: boolean;
  showTimer?: boolean;
  showTicketsSold?: boolean;
  showPrivacyPolicy?: boolean;
  showTerms?: boolean;
  openWhatsAppDirect?: boolean;
  showPreviousWinners?: boolean;
  allowSocialShare?: boolean;
  
  // Colores
  primaryColor?: string;
  primaryColorContrast?: string;
  secondaryColor?: string;
  secondaryColorContrast?: string;
  darkMode?: boolean;
  selectedTheme?: string;
  
  // Branding
  logoUrl?: string;
  faviconUrl?: string;
  heroBackgroundUrl?: string;
  
  // Redes sociales
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
  };
  
  // Contenido
  heroTitle?: string;
  heroSubtitle?: string;
  footerText?: string;
}

/**
 * DTO para actualizar toda la configuración de rifas
 */
export interface UpdateRaffleSettingsDto {
  minutesToClose?: number;
  ticketsPerPage?: number;
  luckyMachineOptions?: string;
  webPageConfig?: Partial<WebPageConfig>;
}

// ==================== TEMAS PREDEFINIDOS ====================

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  primaryColorContrast: string;
  secondaryColor: string;
  secondaryColorContrast: string;
  previewImage?: string;
}

export const PREDEFINED_THEMES: ColorTheme[] = [
  {
    id: 'pink-vibrant',
    name: 'Rosa Vibrante',
    description: 'Enérgico y llamativo',
    primaryColor: '#ff497c',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#10b981',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'ocean-blue',
    name: 'Azul Océano',
    description: 'Profesional y confiable',
    primaryColor: '#3b82f6',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#06b6d4',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'emerald-green',
    name: 'Verde Esmeralda',
    description: 'Fresco y positivo',
    primaryColor: '#10b981',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#059669',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'royal-purple',
    name: 'Morado Real',
    description: 'Elegante y premium',
    primaryColor: '#8b5cf6',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#a855f7',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'energy-orange',
    name: 'Naranja Energía',
    description: 'Vibrante y dinámico',
    primaryColor: '#f97316',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#fb923c',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'passion-red',
    name: 'Rojo Pasión',
    description: 'Intenso y emocionante',
    primaryColor: '#ef4444',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#dc2626',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'fresh-turquoise',
    name: 'Turquesa Fresco',
    description: 'Moderno y limpio',
    primaryColor: '#14b8a6',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#06b6d4',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'premium-gold',
    name: 'Dorado Premium',
    description: 'Lujo y exclusividad',
    primaryColor: '#fbbf24',
    primaryColorContrast: '#1f2937',
    secondaryColor: '#f59e0b',
    secondaryColorContrast: '#1f2937'
  },
  {
    id: 'elegant-black',
    name: 'Negro Elegante',
    description: 'Sofisticado y minimalista',
    primaryColor: '#1f2937',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#374151',
    secondaryColorContrast: '#ffffff'
  },
  {
    id: 'rainbow-festive',
    name: 'Arcoíris Festivo',
    description: 'Alegre y divertido',
    primaryColor: '#ec4899',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#8b5cf6',
    secondaryColorContrast: '#ffffff'
  }
];

// ==================== DEFAULT SETTINGS ====================

export const DEFAULT_RAFFLE_SETTINGS: RaffleSettings = {
  tenantId: '',
  
  // General
  minutesToClose: 30,
  ticketsPerPage: 100,
  luckyMachineOptions: '1,3,5,10',
  
  // Web Page Config
  webPageConfig: {
    // Elementos visibles
    showVerifier: true,
    showParticipants: true,
    showTimer: true,
    showTicketsSold: true,
    showPrivacyPolicy: true,
    showTerms: true,
    openWhatsAppDirect: true,
    showPreviousWinners: true,
    allowSocialShare: true,
    
    // Colores
    primaryColor: '#ff497c',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#10b981',
    secondaryColorContrast: '#ffffff',
    darkMode: false,
    selectedTheme: 'pink-vibrant',
    
    // Branding
    logoUrl: undefined,
    faviconUrl: undefined,
    heroBackgroundUrl: undefined,
    
    // Redes sociales
    socialLinks: {
      facebook: undefined,
      instagram: undefined,
      tiktok: undefined,
      youtube: undefined,
      whatsapp: undefined
    },
    
    // Contenido
    heroTitle: '¡Participa y Gana!',
    heroSubtitle: 'Las mejores rifas con los premios más increíbles',
    footerText: '© 2025 Mi Negocio. Todos los derechos reservados.'
  },
  
  // Metadata
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: undefined
};

// ==================== MOCK DATA ====================

export const MOCK_RAFFLE_SETTINGS: RaffleSettings = {
  id: 'settings-1',
  tenantId: 'tenant-123',
  
  // General
  minutesToClose: 30,
  ticketsPerPage: 100,
  luckyMachineOptions: '1,3,5,10',
  
  // Web Page Config
  webPageConfig: {
    // Elementos visibles
    showVerifier: true,
    showParticipants: true,
    showTimer: true,
    showTicketsSold: true,
    showPrivacyPolicy: true,
    showTerms: true,
    openWhatsAppDirect: true,
    showPreviousWinners: true,
    allowSocialShare: true,
    
    // Colores
    primaryColor: '#ff497c',
    primaryColorContrast: '#ffffff',
    secondaryColor: '#10b981',
    secondaryColorContrast: '#ffffff',
    darkMode: false,
    selectedTheme: 'pink-vibrant',
    
    // Branding
    logoUrl: undefined,
    faviconUrl: undefined,
    heroBackgroundUrl: undefined,
    
    // Redes sociales
    socialLinks: {
      facebook: 'https://facebook.com/mipagina',
      instagram: 'https://instagram.com/mipagina',
      tiktok: undefined,
      youtube: undefined,
      whatsapp: '+52 999 999 9999'
    },
    
    // Contenido
    heroTitle: '¡Participa y Gana!',
    heroSubtitle: 'Las mejores rifas con los premios más increíbles',
    footerText: '© 2025 Mi Negocio. Todos los derechos reservados.'
  },
  
  // Metadata
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  updatedBy: 'admin@lotise.com'
};