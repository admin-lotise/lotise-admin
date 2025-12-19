/**
 * Header/Banner personalizado
 */
export interface CustomHeader {
  id: string;
  tenantId: string;
  
  // Contenido
  title: string;                          // Título del banner
  description?: string;                   // Descripción (opcional)
  imageUrl: string;                       // Imagen de fondo
  linkUrl?: string;                       // Link destino (opcional)
  
  // Configuración
  order: number;                          // Orden de aparición
  isActive: boolean;                      // Activo/Inactivo
  
  // Temporalidad (opcional, para promociones)
  startDate?: Date;                       // Fecha inicio
  endDate?: Date;                         // Fecha fin
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear header
 */
export interface CreateCustomHeaderDto {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

/**
 * DTO para actualizar header
 */
export interface UpdateCustomHeaderDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  order?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}