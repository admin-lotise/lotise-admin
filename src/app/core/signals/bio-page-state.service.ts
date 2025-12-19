import { Injectable, signal, computed } from '@angular/core';
import { BioPage, BioLink, ButtonStyle } from '../../shared/models/bio-page.model';

@Injectable({
  providedIn: 'root'
})
export class BioPageStateService {
  // Signal privado para la bio page
  private readonly _bioPage = signal<BioPage>({
    tenantId: '',
    displayName: '',
    backgroundColor: '#ffffff',
    buttonColor: '#000000',
    buttonStyle: ButtonStyle.ROUNDED,
    links: [],
    updatedAt: new Date()
  });

  // Signal público (readonly)
  readonly bioPage = this._bioPage.asReadonly();

  // Computed signals útiles
  readonly activeLinks = computed(() => 
    this._bioPage().links.filter(l => l.isActive).sort((a, b) => a.order - b.order)
  );

  readonly totalLinks = computed(() => this._bioPage().links.length);

  readonly hasLinks = computed(() => this.activeLinks().length > 0);

  readonly profile = computed(() => ({
    photoUrl: this._bioPage().profilePhotoUrl,
    displayName: this._bioPage().displayName,
    bio: this._bioPage().bio
  }));

  readonly appearance = computed(() => ({
    backgroundColor: this._bioPage().backgroundColor,
    buttonColor: this._bioPage().buttonColor,
    buttonStyle: this._bioPage().buttonStyle
  }));

  /**
   * Establecer bio page completa
   */
  setBioPage(bioPage: BioPage): void {
    this._bioPage.set(bioPage);
  }

  /**
   * Actualizar perfil
   */
  updateProfile(updates: {
    profilePhotoUrl?: string;
    displayName?: string;
    bio?: string;
  }): void {
    this._bioPage.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar apariencia
   */
  updateAppearance(updates: {
    backgroundColor?: string;
    buttonColor?: string;
    buttonStyle?: ButtonStyle;
  }): void {
    this._bioPage.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date()
    }));
  }

  /**
   * Agregar link
   */
  addLink(link: BioLink): void {
    this._bioPage.update(current => ({
      ...current,
      links: [...current.links, link],
      updatedAt: new Date()
    }));
  }

  /**
   * Actualizar link
   */
  updateLink(id: string, updates: Partial<BioLink>): void {
    this._bioPage.update(current => ({
      ...current,
      links: current.links.map(l => l.id === id ? { ...l, ...updates } : l),
      updatedAt: new Date()
    }));
  }

  /**
   * Eliminar link
   */
  deleteLink(id: string): void {
    this._bioPage.update(current => ({
      ...current,
      links: current.links.filter(l => l.id !== id),
      updatedAt: new Date()
    }));
  }

  /**
   * Reordenar links
   */
  reorderLinks(orderedIds: string[]): void {
    this._bioPage.update(current => {
      const linkMap = new Map(current.links.map(l => [l.id, l]));
      const reorderedLinks = orderedIds
        .map((id, index) => {
          const link = linkMap.get(id);
          return link ? { ...link, order: index } : null;
        })
        .filter((l): l is BioLink => l !== null);
      
      return {
        ...current,
        links: reorderedLinks,
        updatedAt: new Date()
      };
    });
  }

  /**
   * Limpiar estado
   */
  clear(): void {
    this._bioPage.set({
      tenantId: '',
      displayName: '',
      backgroundColor: '#ffffff',
      buttonColor: '#000000',
      buttonStyle: ButtonStyle.ROUNDED,
      links: [],
      updatedAt: new Date()
    });
  }
}