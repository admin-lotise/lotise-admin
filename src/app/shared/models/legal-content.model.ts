/**
 * Contenido legal (Aviso de Privacidad y Términos)
 */
export interface LegalContent {
  tenantId: string;
  
  // Aviso de Privacidad
  privacyPolicyHtml: string;              // HTML del aviso
  privacyPolicyLastUpdate: Date;
  
  // Términos y Condiciones
  termsConditionsHtml: string;            // HTML de términos
  termsConditionsLastUpdate: Date;
  
  // Metadata
  updatedAt: Date;
  updatedBy?: string;
}

/**
 * DTO para actualizar contenido legal
 */
export interface UpdateLegalContentDto {
  privacyPolicyHtml?: string;
  termsConditionsHtml?: string;
}