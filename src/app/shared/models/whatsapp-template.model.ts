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
  name: string;
  content: string;
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
  icon: string; // NUEVO
  category: 'reservation' | 'payment' | 'confirmation' | 'notification'; // NUEVO
  color: string; // NUEVO
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
    icon: 'bi-bookmark',
    category: 'reservation',
    color: '#3b82f6',
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
    icon: 'bi-clock-history',
    category: 'payment',
    color: '#f59e0b',
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
    icon: 'bi-receipt',
    category: 'payment',
    color: '#8b5cf6',
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
    icon: 'bi-check-circle',
    category: 'confirmation',
    color: '#10b981',
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
    icon: 'bi-trophy',
    category: 'notification',
    color: '#ef4444',
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
    icon: 'bi-x-circle',
    category: 'notification',
    color: '#dc2626',
    defaultContent: `Hola {$nombre_cliente},

Lamentablemente tus boletos han sido cancelados: {$boletos}

Motivo: {$motivo}

Si deseas volver a participar, puedes apartar nuevos boletos. 🎫`
  }
];

// NUEVO: Helper para obtener categorías
export const TEMPLATE_CATEGORIES = {
  reservation: { 
    label: 'Reservas', 
    icon: 'bi-bookmark', 
    color: '#3b82f6' 
  },
  payment: { 
    label: 'Pagos', 
    icon: 'bi-credit-card', 
    color: '#f59e0b' 
  },
  confirmation: { 
    label: 'Confirmaciones', 
    icon: 'bi-check-circle', 
    color: '#10b981' 
  },
  notification: { 
    label: 'Notificaciones', 
    icon: 'bi-bell', 
    color: '#8b5cf6' 
  }
};

// NUEVO: Mock data para desarrollo
export const MOCK_TEMPLATES: WhatsAppTemplate[] = TEMPLATES_CATALOG.map((info, index) => ({
  id: `template-${index + 1}`,
  tenantId: 'tenant-demo',
  type: info.type,
  name: info.name,
  content: info.defaultContent,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}));