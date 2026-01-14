import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  WhatsAppTemplate,
  TemplateType,
  TEMPLATES_CATALOG,
  TEMPLATE_CATEGORIES,
  MOCK_TEMPLATES,
  TemplateInfo
} from '../../../shared/models/whatsapp-template.model';

type CategoryKey = keyof typeof TEMPLATE_CATEGORIES;

@Component({
  selector: 'app-whatsapp-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-templates.component.html',
  styleUrl: './whatsapp-templates.component.scss'
})
export class WhatsappTemplatesComponent {
  // State
  templates = signal<WhatsAppTemplate[]>(MOCK_TEMPLATES);
  selectedCategory = signal<string>('all');
  searchTerm = signal<string>('');
  
  // Categories & Catalog
  categories = TEMPLATE_CATEGORIES;
  catalog = TEMPLATES_CATALOG;
  
  // Computed
  templatesWithInfo = computed(() => {
    return this.templates().map(template => {
      const info = this.catalog.find(t => t.type === template.type);
      return {
        ...template,
        info: info || null
      };
    });
  });

  filteredTemplates = computed(() => {
    let filtered = this.templatesWithInfo();
    
    // Filter by category
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(t => 
        t.info?.category === this.selectedCategory()
      );
    }
    
    // Filter by search
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.info?.description.toLowerCase().includes(search) ||
        t.content.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  });
  
  stats = computed(() => {
    const all = this.templates();
    const withInfo = this.templatesWithInfo();
    
    return {
      total: all.length,
      active: all.filter(t => t.isActive).length,
      inactive: all.filter(t => !t.isActive).length,
      byCategory: (Object.keys(this.categories) as CategoryKey[]).map(key => ({
        key,
        label: this.categories[key].label,
        icon: this.categories[key].icon,
        color: this.categories[key].color,
        count: withInfo.filter(t => t.info?.category === key).length
      }))
    };
  });

  constructor(private router: Router) {}

  // Actions
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  editTemplate(template: WhatsAppTemplate): void {
    this.router.navigate(['/settings/whatsapp-templates/editor', template.id]);
  }

  toggleTemplate(template: WhatsAppTemplate): void {
    this.templates.update(templates => 
      templates.map(t => 
        t.id === template.id 
          ? { ...t, isActive: !t.isActive, updatedAt: new Date() }
          : t
      )
    );
  }

  duplicateTemplate(template: WhatsAppTemplate): void {
    const newTemplate: WhatsAppTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copia)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.templates.update(templates => [...templates, newTemplate]);
  }

  deleteTemplate(template: WhatsAppTemplate): void {
    if (confirm(`¿Estás seguro de eliminar la plantilla "${template.name}"?`)) {
      this.templates.update(templates => 
        templates.filter(t => t.id !== template.id)
      );
    }
  }

  createNewTemplate(): void {
    this.router.navigate(['/settings/whatsapp-templates/editor', 'new']);
  }

  testTemplate(template: WhatsAppTemplate): void {
    // TODO: Implement test functionality
    console.log('Testing template:', template);
    alert('📱 Función de prueba:\n\nSe enviará un mensaje de WhatsApp de prueba con esta plantilla.\n\n(Pendiente de implementar)');
  }

  // Helper to get template info
  getTemplateInfo(type: TemplateType): TemplateInfo | undefined {
    return this.catalog.find(t => t.type === type);
  }

  // Helper to get variables length safely
  getVariablesLength(template: { info: TemplateInfo | null }): number {
    return template.info?.variables?.length ?? 0;
  }
}