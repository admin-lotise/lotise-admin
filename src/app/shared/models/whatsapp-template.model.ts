/**
 * Tipos de plantillas de WhatsApp
 */
export enum TemplateType {
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_VALIDATED = 'PAYMENT_VALIDATED',
  WINNER_NOTIFICATION = 'WINNER_NOTIFICATION',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED'
}

/**
 * Variables disponibles para cada tipo de plantilla
 */
export interface TemplateVariables {
  [key: string]: string;
}

/**
 * Plantilla de WhatsApp
 */
export interface WhatsAppTemplate {
  id: string;
  tenantId: string;
  type: TemplateType;
  name: string;                           // Nombre descriptivo
  content: string;                        // Contenido con variables {$variable}
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear/actualizar plantilla
 */
export interface SaveWhatsAppTemplateDto {
  type: TemplateType;
  name: string;
  content: string;
  isActive: boolean;
}

/**
 * Información de plantilla con variables disponibles
 */
export interface TemplateInfo {
  type: TemplateType;
  name: string;
  description: string;
  variables: string[];
  defaultContent: string;
}

/**
 * Catálogo de plantillas con sus variables
 */
export const TEMPLATES_CATALOG: TemplateInfo[] = [
  {
    type: TemplateType.BOOKING_CONFIRMATION,
    name: 'Confirmación de Apartado',
    description: 'Mensaje enviado cuando un cliente aparta boletos',
    variables: ['nombre_cliente', 'boletos', 'monto', 'tiempo_apartado', 'fecha_limite'],
    defaultContent: `¡Hola {$nombre_cliente}! 👋

Has apartado exitosamente los siguientes boletos: {$boletos}

💰 Monto a pagar: {$monto}
⏰ Tiempo de apartado: {$tiempo_apartado} minutos
📅 Fecha límite: {$fecha_limite}

Por favor realiza tu pago antes de la fecha límite para asegurar tus boletos.

¡Mucha suerte! 🍀`
  },
  {
    type: TemplateType.PAYMENT_REMINDER,
    name: 'Recordatorio de Pago',
    description: 'Recordatorio enviado antes del vencimiento',
    variables: ['nombre_cliente', 'boletos', 'monto', 'tiempo_restante'],
    defaultContent: `Hola {$nombre_cliente} 👋

Te recordamos que tienes boletos apartados: {$boletos}

💰 Monto: {$monto}
⏰ Tiempo restante: {$tiempo_restante}

No pierdas tus boletos, ¡paga antes de que se liberen! 🎫`
  },
  {
    type: TemplateType.PAYMENT_RECEIVED,
    name: 'Comprobante de Pago Recibido',
    description: 'Confirmación de que se recibió el comprobante',
    variables: ['nombre_cliente', 'boletos', 'monto', 'metodo_pago'],
    defaultContent: `¡Gracias {$nombre_cliente}! 🙏

Hemos recibido tu comprobante de pago.

🎫 Boletos: {$boletos}
💰 Monto: {$monto}
💳 Método: {$metodo_pago}

Estamos validando tu pago. Te notificaremos pronto. ⏳`
  },
  {
    type: TemplateType.PAYMENT_VALIDATED,
    name: 'Confirmación de Pago Validado',
    description: 'Confirmación de que el pago fue validado',
    variables: ['nombre_cliente', 'boletos', 'numero_rifa'],
    defaultContent: `¡Felicidades {$nombre_cliente}! 🎉

Tu pago ha sido validado exitosamente.

✅ Boletos confirmados: {$boletos}
🎲 Rifa: {$numero_rifa}

¡Mucha suerte en el sorteo! 🍀✨`
  },
  {
    type: TemplateType.WINNER_NOTIFICATION,
    name: 'Notificación de Ganador',
    description: 'Notificación al ganador del sorteo',
    variables: ['nombre_cliente', 'premio', 'numero_rifa', 'fecha_sorteo'],
    defaultContent: `🎊 ¡FELICIDADES {$nombre_cliente}! 🎊

¡HAS GANADO! 🏆

🎁 Premio: {$premio}
🎲 Rifa: {$numero_rifa}
📅 Sorteo: {$fecha_sorteo}

Nos pondremos en contacto contigo para la entrega del premio. 🎉`
  },
  {
    type: TemplateType.BOOKING_CANCELLED,
    name: 'Cancelación de Apartado',
    description: 'Notificación de cancelación de boletos',
    variables: ['nombre_cliente', 'boletos', 'motivo'],
    defaultContent: `Hola {$nombre_cliente},

Lamentablemente tus boletos han sido cancelados: {$boletos}

Motivo: {$motivo}

Si deseas volver a participar, puedes apartar nuevos boletos. 🎫`
  }
];