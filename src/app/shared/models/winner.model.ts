/**
 * Ganador de rifa
 */
export interface Winner {
  id: string;
  tenantId: string;
  
  // Información del ganador
  name: string;                           // Nombre del ganador
  raffleId: string;                       // ID de la rifa ganada
  raffleName: string;                     // Nombre de la rifa
  prize: string;                          // Descripción del premio
  drawDate: Date;                         // Fecha del sorteo
  
  // Multimedia
  photoUrl?: string;                      // Foto del ganador (opcional)
  testimonial?: string;                   // Testimonio (opcional)
  
  // Visibilidad
  isActive: boolean;                      // Mostrar/Ocultar en web
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear ganador
 */
export interface CreateWinnerDto {
  name: string;
  raffleId: string;
  raffleName: string;
  prize: string;
  drawDate: Date;
  photoUrl?: string;
  testimonial?: string;
  isActive: boolean;
}

/**
 * DTO para actualizar ganador
 */
export interface UpdateWinnerDto {
  name?: string;
  prize?: string;
  photoUrl?: string;
  testimonial?: string;
  isActive?: boolean;
}