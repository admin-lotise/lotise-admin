import { Component, signal, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LegalContent, MOCK_LEGAL_CONTENT } from '../../../../shared/models/legal-content.model';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent implements OnInit, AfterViewInit {
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
    const html = legalContent.privacyPolicyHtml || this.getDefaultTemplate();
    
    this.content.set(html);
    this.originalContent.set(html);
    this.updateStats();
  }

  getDefaultTemplate(): string {
    return `<h1>Política de Privacidad</h1>

<h2>1. Información que Recopilamos</h2>
<p>En <strong>[Nombre de tu Negocio]</strong>, recopilamos la siguiente información personal:</p>
<ul>
  <li>Nombre completo</li>
  <li>Número de teléfono</li>
  <li>Correo electrónico (opcional)</li>
  <li>Información de pago</li>
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
<p>Nos comprometemos a mantener tu información segura y confidencial.</p>

<h2>4. Tus Derechos</h2>
<p>Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento.</p>

<h2>5. Contacto</h2>
<p>Para preguntas sobre privacidad, contáctanos:</p>
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
    // No llamar syncContent aquí, el evento input lo hará
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
      // await this.legalService.updatePrivacyPolicy({
      //   privacyPolicyHtml: this.content()
      // });

      console.log('Saved privacy policy:', this.content());
      
      this.originalContent.set(this.content());
      this.hasChanges.set(false);
      
      alert('✅ Política de Privacidad guardada correctamente');
      
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