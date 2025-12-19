import { Injectable, signal, computed } from '@angular/core';
import { WhatsAppTemplate, TemplateType } from '../../shared/models/whatsapp-template.model';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppTemplatesStateService {
  // Signal privado para las plantillas
  private readonly _templates = signal<WhatsAppTemplate[]>([]);

  // Signal público (readonly)
  readonly templates = this._templates.asReadonly();

  // Computed signals útiles
  readonly activeTemplates = computed(() => 
    this._templates().filter(t => t.isActive)
  );

  readonly templatesByType = computed(() => {
    const byType = new Map<TemplateType, WhatsAppTemplate>();
    this._templates().forEach(template => {
      byType.set(template.type, template);
    });
    return byType;
  });

  /**
   * Establecer lista completa de plantillas
   */
  setTemplates(templates: WhatsAppTemplate[]): void {
    this._templates.set(templates);
  }

  /**
   * Agregar nueva plantilla
   */
  addTemplate(template: WhatsAppTemplate): void {
    this._templates.update(templates => [...templates, template]);
  }

  /**
   * Actualizar plantilla existente
   */
  updateTemplate(id: string, updates: Partial<WhatsAppTemplate>): void {
    this._templates.update(templates =>
      templates.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)
    );
  }

  /**
   * Eliminar plantilla
   */
  deleteTemplate(id: string): void {
    this._templates.update(templates => templates.filter(t => t.id !== id));
  }

  /**
   * Obtener plantilla por tipo
   */
  getTemplateByType(type: TemplateType): WhatsAppTemplate | undefined {
    return this._templates().find(t => t.type === type);
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._templates.set([]);
  }
}