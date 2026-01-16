import { Component, signal, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LegalContent, MOCK_LEGAL_CONTENT } from '../../../../shared/models/legal-content.model';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss'
})
export class TermsConditionsComponent implements OnInit, AfterViewInit {
  @ViewChild('contentEditor', { static: false }) contentEditor!: ElementRef<HTMLDivElement>;

  // State
  content = signal<string>('');
  originalContent = signal<string>('');
  isSaving = signal(false);
  hasChanges = signal(false);
  showPreview = signal(false);

  // Stats
  wordCount = signal(0);
  characterCount = signal(0);

  private isInitialized = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadContent();
  }

  ngAfterViewInit(): void {
    // Inicializar el editor después de que la vista esté lista
    if (this.contentEditor) {
      this.contentEditor.nativeElement.innerHTML = this.content();
      this.isInitialized = true;
    }
  }

  loadContent(): void {
    // Load from mock data
    const legalContent = MOCK_LEGAL_CONTENT;
    const html = legalContent.termsConditionsHtml || this.getDefaultTemplate();
    
    this.content.set(html);
    this.originalContent.set(html);
    this.updateStats();
  }

  getDefaultTemplate(): string {
    return `<h1>Términos y Condiciones</h1>

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

<p><strong>Última actualización:</strong> ${new Date().toLocaleDateString('es-MX')}</p>`;
  }

  onContentChange(): void {
    if (!this.isInitialized || !this.contentEditor) return;
    
    const newContent = this.contentEditor.nativeElement.innerHTML;
    this.content.set(newContent);
    this.updateStats();
    this.checkForChanges();
  }

  updateStats(): void {
    const text = this.stripHtml(this.content());
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    
    this.wordCount.set(words.length);
    this.characterCount.set(text.length);
  }

  checkForChanges(): void {
    this.hasChanges.set(this.content() !== this.originalContent());
  }

  stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Formatting functions
  formatText(command: string, value?: string): void {
    document.execCommand(command, false, value);
    // No llamar a onContentChange aquí, el evento input lo hará
  }

  insertHeading(level: number): void {
    this.formatText('formatBlock', `<h${level}>`);
  }

  insertList(ordered: boolean): void {
    this.formatText(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  }

  togglePreview(): void {
    this.showPreview.update(val => !val);
  }

  async save(): Promise<void> {
    if (!this.hasChanges() || this.isSaving()) return;

    this.isSaving.set(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Call actual API
      // await this.legalService.updateTermsConditions({
      //   termsConditionsHtml: this.content()
      // });

      console.log('Saved terms and conditions:', this.content());
      
      this.originalContent.set(this.content());
      this.hasChanges.set(false);
      
      alert('✅ Términos y Condiciones guardados correctamente');
      
    } catch (error) {
      console.error('Error saving:', error);
      alert('❌ Error al guardar. Intenta de nuevo.');
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel(): void {
    if (this.hasChanges()) {
      const confirm = window.confirm('¿Descartar los cambios no guardados?');
      if (!confirm) return;
    }
    
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/settings/legal-content']);
  }

  resetToDefault(): void {
    const confirm = window.confirm(
      '¿Restablecer al contenido predeterminado? Se perderán todos los cambios.'
    );
    
    if (confirm && this.contentEditor) {
      const defaultContent = this.getDefaultTemplate();
      this.contentEditor.nativeElement.innerHTML = defaultContent;
      this.content.set(defaultContent);
      this.updateStats();
      this.checkForChanges();
    }
  }
}