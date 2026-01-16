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

// ==================== MOCK DATA ====================
export const MOCK_LEGAL_CONTENT: LegalContent = {
  tenantId: 'tenant-demo',
  
  // Privacy Policy
  privacyPolicyHtml: `<h1>Política de Privacidad</h1>

<h2>1. Información que Recopilamos</h2>
<p>En <strong>Tu Empresa de Rifas</strong>, recopilamos la siguiente información personal:</p>
<ul>
  <li>Nombre completo</li>
  <li>Número de teléfono</li>
  <li>Correo electrónico (opcional)</li>
  <li>Información de pago (datos bancarios para transferencias)</li>
</ul>

<h2>2. Uso de la Información</h2>
<p>Utilizamos tu información personal para:</p>
<ul>
  <li>Procesar tus reservas de boletos</li>
  <li>Enviarte confirmaciones por WhatsApp</li>
  <li>Validar tus pagos</li>
  <li>Notificarte si resultas ganador</li>
  <li>Mejorar nuestros servicios</li>
</ul>

<h2>3. Protección de Datos</h2>
<p>Nos comprometemos a:</p>
<ul>
  <li>Mantener tu información segura y confidencial</li>
  <li>No compartir tus datos con terceros sin tu consentimiento</li>
  <li>Usar medidas de seguridad para proteger tu información</li>
  <li>Cumplir con las leyes de protección de datos</li>
</ul>

<h2>4. WhatsApp</h2>
<p>Usamos WhatsApp Business para comunicarnos contigo. Al proporcionar tu número:</p>
<ul>
  <li>Aceptas recibir mensajes sobre tus reservas</li>
  <li>Puedes solicitar dejar de recibir mensajes en cualquier momento</li>
  <li>Solo enviamos información relacionada con tus compras</li>
</ul>

<h2>5. Tus Derechos</h2>
<p>Tienes derecho a:</p>
<ul>
  <li>Acceder a tu información personal</li>
  <li>Solicitar corrección de datos incorrectos</li>
  <li>Solicitar eliminación de tus datos</li>
  <li>Retirar tu consentimiento en cualquier momento</li>
</ul>

<h2>6. Contacto</h2>
<p>Para ejercer tus derechos o preguntas sobre privacidad:</p>
<ul>
  <li>WhatsApp: [Tu número]</li>
  <li>Email: [Tu email]</li>
</ul>

<p><strong>Última actualización:</strong> 15 de enero de 2025</p>`,
  privacyPolicyLastUpdate: new Date('2025-01-15'),
  
  // Terms & Conditions
  termsConditionsHtml: `<h1>Términos y Condiciones</h1>

<h2>1. Aceptación de Términos</h2>
<p>Al reservar boletos en nuestras rifas, aceptas estos términos y condiciones.</p>

<h2>2. Reserva de Boletos</h2>
<h3>2.1 Proceso de Reserva</h3>
<ul>
  <li>Los boletos se reservan por tiempo limitado (configurado por rifa)</li>
  <li>Debes completar el pago antes del tiempo límite</li>
  <li>Los boletos no pagados se liberan automáticamente</li>
</ul>

<h3>2.2 Selección de Boletos</h3>
<ul>
  <li>Puedes elegir números específicos (si está disponible)</li>
  <li>Usar la "máquina de la suerte" para selección aleatoria</li>
  <li>Los números ya vendidos no están disponibles</li>
</ul>

<h2>3. Pagos</h2>
<h3>3.1 Métodos de Pago</h3>
<ul>
  <li>Transferencia bancaria</li>
  <li>Depósito en efectivo</li>
  <li>Otros métodos publicados en cada rifa</li>
</ul>

<h3>3.2 Validación de Pagos</h3>
<ul>
  <li>Debes enviar comprobante de pago</li>
  <li>El pago será validado en máximo 24 horas</li>
  <li>Los boletos se confirman solo después de validar el pago</li>
</ul>

<h3>3.3 Reembolsos</h3>
<ul>
  <li>No se hacen reembolsos una vez validado el pago</li>
  <li>Excepto por cancelación de la rifa por nuestra parte</li>
</ul>

<h2>4. Sorteos</h2>
<h3>4.1 Fecha y Hora</h3>
<ul>
  <li>Los sorteos se realizan en la fecha y hora publicadas</li>
  <li>Pueden posponerse por causas de fuerza mayor</li>
  <li>Se notificará cualquier cambio con anticipación</li>
</ul>

<h3>4.2 Ganadores</h3>
<ul>
  <li>Los ganadores se anuncian públicamente</li>
  <li>Se notifica al ganador por WhatsApp</li>
  <li>El ganador tiene 30 días para reclamar su premio</li>
</ul>

<h3>4.3 Entrega de Premios</h3>
<ul>
  <li>Los premios se entregan según lo publicado</li>
  <li>Pueden requerirse documentos de identificación</li>
  <li>Los gastos de envío pueden aplicar</li>
</ul>

<h2>5. Responsabilidades</h2>
<h3>5.1 Del Usuario</h3>
<ul>
  <li>Proporcionar información correcta</li>
  <li>Enviar comprobantes de pago válidos</li>
  <li>Mantener su número de WhatsApp activo</li>
  <li>Reclamar premios en tiempo</li>
</ul>

<h3>5.2 De la Empresa</h3>
<ul>
  <li>Realizar sorteos de forma transparente</li>
  <li>Validar pagos correctamente</li>
  <li>Entregar premios a ganadores</li>
  <li>Proteger información personal</li>
</ul>

<h2>6. Cancelaciones</h2>
<p>Nos reservamos el derecho de:</p>
<ul>
  <li>Cancelar rifas por causas de fuerza mayor</li>
  <li>Reembolsar pagos en caso de cancelación</li>
  <li>Modificar términos con previo aviso</li>
</ul>

<h2>7. Contacto</h2>
<p>Para dudas sobre términos y condiciones:</p>
<ul>
  <li>WhatsApp: [Tu número]</li>
  <li>Email: [Tu email]</li>
</ul>

<p><strong>Última actualización:</strong> 15 de enero de 2025</p>`,
  termsConditionsLastUpdate: new Date('2025-01-15'),
  
  updatedAt: new Date('2025-01-15'),
  updatedBy: 'Admin'
};