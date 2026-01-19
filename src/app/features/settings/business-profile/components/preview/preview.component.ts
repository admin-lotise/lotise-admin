import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsStateService } from '../../../../../core/signals/settings-state.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements OnInit {
  // Services
  private readonly settingsState = inject(SettingsStateService);

  // Device preview mode
  deviceMode = signal<'mobile' | 'tablet' | 'desktop'>('mobile');

  // Computed sections from BioPage
  readonly bioPage = computed(() => this.settingsState.bioPage());
  readonly howItWorks = computed(() => this.bioPage().howItWorks);
  readonly testimonials = computed(() => this.bioPage().testimonials);
  readonly faqs = computed(() => this.bioPage().faqs);
  readonly contact = computed(() => this.bioPage().contact);
  
  // Computed from Business Profile
  readonly businessProfile = computed(() => this.settingsState.businessProfile());
  
  // Profile info (combinación de businessProfile y contactInfo)
  readonly profile = computed(() => {
    const bp = this.businessProfile();
    return {
      displayName: bp.businessName,
      bio: this.extractPlainText(bp.aboutUs).substring(0, 150), // Primeros 150 chars
      photoUrl: bp.logoUrl
    };
  });

  // Preview URL
  readonly previewUrl = computed(() => {
    const businessName = this.businessProfile().businessName || 'preview';
    const slug = businessName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-')          // Espacios a guiones
      .replace(/-+/g, '-')           // Múltiples guiones a uno
      .trim();
    return `${window.location.origin}/bio/${slug}`;
  });

  // Stars helper
  readonly maxRating = 5;

  ngOnInit(): void {
    // Componente de solo lectura, no necesita lógica adicional
  }

  /**
   * Cambiar modo de dispositivo
   */
  setDeviceMode(mode: 'mobile' | 'tablet' | 'desktop'): void {
    this.deviceMode.set(mode);
  }

  /**
   * Limpiar número de WhatsApp (solo dígitos)
   */
  cleanWhatsAppNumber(phone: string | undefined): string {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  }

  /**
   * Obtener array de estrellas para rating
   */
  getStars(rating: number): boolean[] {
    return Array.from({ length: this.maxRating }, (_, i) => i < rating);
  }

  /**
   * Copiar URL al portapapeles
   */
  async copyUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.previewUrl());
      this.showToast('URL copiada al portapapeles');
    } catch (error) {
      console.error('Error copiando URL:', error);
      // Fallback para navegadores que no soportan clipboard API
      this.copyUrlFallback();
    }
  }

  /**
   * Fallback para copiar URL (navegadores antiguos)
   */
  private copyUrlFallback(): void {
    const textarea = document.createElement('textarea');
    textarea.value = this.previewUrl();
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      this.showToast('URL copiada al portapapeles');
    } catch (error) {
      console.error('Error copiando URL:', error);
      alert('No se pudo copiar la URL. Por favor cópiala manualmente:\n\n' + this.previewUrl());
    }
    
    document.body.removeChild(textarea);
  }

  /**
   * Abrir en nueva pestaña
   */
  openInNewTab(): void {
    window.open(this.previewUrl(), '_blank');
  }

  /**
   * Extraer texto plano de HTML
   */
  private extractPlainText(html: string): string {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * Mostrar toast (puedes implementar un toast service más adelante)
   */
  private showToast(message: string): void {
    // Implementación simple con alert
    // TODO: Reemplazar con un toast service profesional
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}