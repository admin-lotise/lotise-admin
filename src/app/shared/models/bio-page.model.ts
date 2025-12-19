/**
 * Configuración de página Bio (tipo Linktree)
 */
export interface BioPage {
  tenantId: string;
  
  // Perfil
  profilePhotoUrl?: string;               // Foto de perfil
  displayName: string;                    // Nombre/Título
  bio?: string;                           // Biografía
  
  // Apariencia
  backgroundColor: string;                // Color de fondo
  buttonColor: string;                    // Color de botones
  buttonStyle: ButtonStyle;               // Estilo de botones
  
  // Links
  links: BioLink[];                       // Array de links
  
  // Metadata
  updatedAt: Date;
  updatedBy?: string;
}

/**
 * Link de página Bio
 */
export interface BioLink {
  id: string;
  title: string;                          // Título del link
  url: string;                            // URL destino
  icon?: string;                          // Icono Font Awesome (ej: 'fab fa-instagram')
  order: number;                          // Orden de aparición
  isActive: boolean;                      // Visible/Oculto
}

/**
 * Estilos de botón disponibles
 */
export enum ButtonStyle {
  SQUARE = 'SQUARE',                      // Cuadrado
  ROUNDED = 'ROUNDED',                    // Redondeado
  PILL = 'PILL'                           // Píldora (muy redondeado)
}

/**
 * DTO para actualizar Bio Page
 */
export interface UpdateBioPageDto {
  profilePhotoUrl?: string;
  displayName?: string;
  bio?: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonStyle?: ButtonStyle;
}

/**
 * DTO para crear Bio Link
 */
export interface CreateBioLinkDto {
  title: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

/**
 * DTO para actualizar Bio Link
 */
export interface UpdateBioLinkDto {
  title?: string;
  url?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}