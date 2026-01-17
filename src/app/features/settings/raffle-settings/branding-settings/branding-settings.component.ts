import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebPageConfig, PREDEFINED_THEMES, ColorTheme } from '../../../../shared/models/raffle-settings.model';

@Component({
  selector: 'app-branding-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branding-settings.component.html',
  styleUrl: './branding-settings.component.scss'
})
export class BrandingSettingsComponent implements OnInit {
  @Input() webPageConfig!: WebPageConfig;
  @Input() isLoading = false;
  @Input() userPlan: 'BASICO' | 'EMPRENDEDOR' | 'PROFESIONAL' = 'BASICO';
  @Output() save = new EventEmitter<any>();

  // Temas disponibles
  themes = PREDEFINED_THEMES;

  // Tema seleccionado
  selectedThemeId = signal<string>('pink-vibrant');

  // Mensajes
  successMessage = signal<string | null>(null);
  upgradeMessage = signal<string | null>(null);

  // Plan simulado (para demostración)
  simulatedPlan = signal<'BASICO' | 'EMPRENDEDOR' | 'PROFESIONAL'>('BASICO');
  isUpgrading = signal<boolean>(false);

  ngOnInit(): void {
    // Cargar tema actual
    if (this.webPageConfig?.selectedTheme) {
      this.selectedThemeId.set(this.webPageConfig.selectedTheme);
    }
    
    // Inicializar plan simulado con el plan real
    this.simulatedPlan.set(this.userPlan);
  }

  /**
   * Verifica si el usuario tiene acceso a branding
   */
  hasAccess(): boolean {
    return this.simulatedPlan() === 'EMPRENDEDOR' || this.simulatedPlan() === 'PROFESIONAL';
  }

  /**
   * Simula la actualización del plan
   */
  simulateUpgrade(): void {
    this.isUpgrading.set(true);
    
    // Simular delay de actualización (como si se llamara a un servicio)
    setTimeout(() => {
      // Actualizar a plan EMPRENDEDOR
      this.simulatedPlan.set('EMPRENDEDOR');
      this.isUpgrading.set(false);
      
      // Mostrar mensaje de éxito
      this.upgradeMessage.set('🎉 ¡Felicidades! Tu plan ha sido actualizado a EMPRENDEDOR');
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        this.upgradeMessage.set(null);
      }, 5000);
    }, 2000); // 2 segundos de "carga"
  }

  /**
   * Selecciona un tema
   */
  selectTheme(themeId: string): void {
    if (!this.hasAccess()) {
      return; // No permitir selección si no tiene acceso
    }
    this.selectedThemeId.set(themeId);
  }

  /**
   * Obtiene el tema seleccionado
   */
  getSelectedTheme(): ColorTheme | undefined {
    return this.themes.find(t => t.id === this.selectedThemeId());
  }

  /**
   * Aplica el tema seleccionado
   */
  applyTheme(): void {
    if (!this.hasAccess()) {
      return; // No permitir aplicar si no tiene acceso
    }

    const theme = this.getSelectedTheme();
    
    if (!theme) {
      return;
    }

    const themeData = {
      primaryColor: theme.primaryColor,
      primaryColorContrast: theme.primaryColorContrast,
      secondaryColor: theme.secondaryColor,
      secondaryColorContrast: theme.secondaryColorContrast,
      selectedTheme: theme.id
    };

    this.save.emit(themeData);
    this.showSuccessMessage();
  }

  /**
   * Verifica si un tema está activo
   */
  isThemeActive(themeId: string): boolean {
    return this.selectedThemeId() === themeId;
  }

  /**
   * Muestra mensaje de éxito
   */
  showSuccessMessage(): void {
    this.successMessage.set('✅ Tema aplicado correctamente');
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  /**
   * Obtiene el nombre del plan
   */
  getPlanName(): string {
    const planNames = {
      'BASICO': 'Básico',
      'EMPRENDEDOR': 'Emprendedor',
      'PROFESIONAL': 'Profesional'
    };
    return planNames[this.simulatedPlan()];
  }

  /**
   * Resetea el plan simulado (para pruebas)
   */
  resetPlan(): void {
    this.simulatedPlan.set('BASICO');
    this.upgradeMessage.set(null);
  }
}