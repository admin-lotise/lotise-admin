/**
 * Pregunta frecuente
 */
export interface FAQ {
  id: string;
  tenantId: string;
  
  question: string;                       // Pregunta
  answerHtml: string;                     // Respuesta en HTML
  order: number;                          // Orden de aparición
  isActive: boolean;                      // Visible/Oculto
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear FAQ
 */
export interface CreateFAQDto {
  question: string;
  answerHtml: string;
  order: number;
  isActive: boolean;
}

/**
 * DTO para actualizar FAQ
 */
export interface UpdateFAQDto {
  question?: string;
  answerHtml?: string;
  order?: number;
  isActive?: boolean;
}