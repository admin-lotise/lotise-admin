import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  WhatsAppTemplate,
  TemplateType,
  TEMPLATES_CATALOG,
  MOCK_TEMPLATES,
  TemplateInfo
} from '../../../../shared/models/whatsapp-template.model';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss'
})
export class TemplateEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // State
  isEditMode = signal(false);
  templateId = signal<string | null>(null);
  
  // Form fields
  selectedType = signal<TemplateType>(TemplateType.BOOKING_CONFIRMATION);
  templateName = signal('');
  templateContent = signal('');
  isActive = signal(true);

  // Catalog
  catalog = TEMPLATES_CATALOG;
  templateTypes = Object.values(TemplateType);

  // Computed
  currentTemplateInfo = computed(() => {
    return this.catalog.find(t => t.type === this.selectedType());
  });

  availableVariables = computed(() => {
    return this.currentTemplateInfo()?.variables || [];
  });

  // Preview with replaced variables
  previewContent = computed(() => {
    let content = this.templateContent();
    const variables = this.availableVariables();
    
    // Replace each variable with example
    variables.forEach(variable => {
      const regex = new RegExp(`\\{\\$${variable}\\}`, 'g');
      const example = this.getVariableExample(variable);
      content = content.replace(regex, example);
    });
    
    return content;
  });

  // Character count
  characterCount = computed(() => this.templateContent().length);
  
  // Validation
  isValid = computed(() => {
    return this.templateName().trim().length > 0 &&
           this.templateContent().trim().length > 0;
  });

  isSaving = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.templateId.set(id);
      this.loadTemplate(id);
    } else {
      // New template - load default content
      this.loadDefaultContent();
    }
  }

  loadTemplate(id: string): void {
    // Mock: Find template in MOCK_TEMPLATES
    const template = MOCK_TEMPLATES.find(t => t.id === id);
    
    if (template) {
      this.selectedType.set(template.type);
      this.templateName.set(template.name);
      this.templateContent.set(template.content);
      this.isActive.set(template.isActive);
    } else {
      alert('Plantilla no encontrada');
      this.goBack();
    }
  }

  loadDefaultContent(): void {
    const info = this.currentTemplateInfo();
    if (info) {
      this.templateName.set(info.name);
      this.templateContent.set(info.defaultContent);
    }
  }

  onTypeChange(): void {
    if (!this.isEditMode()) {
      // Only reload defaults when creating new template
      this.loadDefaultContent();
    }
  }

  insertVariable(variable: string): void {
    const cursorPos = this.getCursorPosition();
    const content = this.templateContent();
    const variableText = `{$${variable}}`;
    
    const newContent = 
      content.substring(0, cursorPos) +
      variableText +
      content.substring(cursorPos);
    
    this.templateContent.set(newContent);
  }

  private getCursorPosition(): number {
    const textarea = document.querySelector('textarea');
    return textarea?.selectionStart || this.templateContent().length;
  }

  getVariableExample(variable: string): string {
    const examples: Record<string, string> = {
      'nombre_cliente': 'Juan Pérez',
      'boletos': '001, 002, 003',
      'monto': '$300 MXN',
      'tiempo_apartado': '15',
      'fecha_limite': '15 Ene 2025, 3:30 PM',
      'tiempo_restante': '5 minutos',
      'metodo_pago': 'Transferencia BBVA',
      'numero_rifa': 'iPhone 15 Pro',
      'premio': 'iPhone 15 Pro Max 256GB',
      'fecha_sorteo': '25 Diciembre 2024',
      'motivo': 'Tiempo de apartado expirado'
    };
    
    return examples[variable] || `{${variable}}`;
  }

  // ==================== NUEVO: Helper para obtener nombre del tipo ====================
  getTypeName(type: TemplateType): string {
    const info = this.catalog.find(t => t.type === type);
    return info?.name || type;
  }

  async saveTemplate(): Promise<void> {
    if (!this.isValid()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.isSaving.set(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const template: WhatsAppTemplate = {
        id: this.templateId() || `template-${Date.now()}`,
        tenantId: 'tenant-demo',
        type: this.selectedType(),
        name: this.templateName(),
        content: this.templateContent(),
        isActive: this.isActive(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Saving template:', template);
      
      // TODO: Call API to save template
      // await this.templateService.saveTemplate(template);

      alert(this.isEditMode() ? 'Plantilla actualizada' : 'Plantilla creada');
      this.goBack();

    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error al guardar la plantilla');
    } finally {
      this.isSaving.set(false);
    }
  }

  testTemplate(): void {
    console.log('Testing template with preview:', this.previewContent());
    alert('📱 Vista previa del mensaje:\n\n' + this.previewContent());
  }

  goBack(): void {
    this.router.navigate(['/settings/whatsapp-templates']);
  }

  // Format helpers
  formatBold(text: string): void {
    this.wrapText(`*${text}*`);
  }

  formatItalic(text: string): void {
    this.wrapText(`_${text}_`);
  }

  formatStrikethrough(text: string): void {
    this.wrapText(`~${text}~`);
  }

  private wrapText(wrapper: string): void {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = this.templateContent();
    const selectedText = content.substring(start, end);

    if (selectedText) {
      const newContent =
        content.substring(0, start) +
        wrapper.replace('{text}', selectedText) +
        content.substring(end);
      
      this.templateContent.set(newContent);
    }
  }
}