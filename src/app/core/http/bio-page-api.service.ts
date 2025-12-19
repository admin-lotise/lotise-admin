import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  BioPage, 
  BioLink, 
  UpdateBioPageDto, 
  CreateBioLinkDto, 
  UpdateBioLinkDto 
} from '../../shared/models/bio-page.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BioPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bio-page`;

  /**
   * Obtener Bio Page del tenant
   */
  getBioPage(tenantId: string): Observable<BioPage> {
    return this.http.get<BioPage>(`${this.baseUrl}/${tenantId}`);
  }

  /**
   * Actualizar Bio Page (perfil y apariencia)
   */
  updateBioPage(tenantId: string, updates: UpdateBioPageDto): Observable<BioPage> {
    return this.http.put<BioPage>(`${this.baseUrl}/${tenantId}`, updates);
  }

  /**
   * Subir foto de perfil
   */
  uploadProfilePhoto(tenantId: string, file: File): Observable<{ profilePhotoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<{ profilePhotoUrl: string }>(
      `${this.baseUrl}/${tenantId}/upload-profile-photo`, 
      formData
    );
  }

  /**
   * Eliminar foto de perfil
   */
  deleteProfilePhoto(tenantId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/profile-photo`);
  }

  // ==================== BIO LINKS ====================

  /**
   * Obtener todos los links
   */
  getLinks(tenantId: string): Observable<BioLink[]> {
    return this.http.get<BioLink[]>(`${this.baseUrl}/${tenantId}/links`);
  }

  /**
   * Crear nuevo link
   */
  createLink(tenantId: string, link: CreateBioLinkDto): Observable<BioLink> {
    return this.http.post<BioLink>(`${this.baseUrl}/${tenantId}/links`, link);
  }

  /**
   * Actualizar link
   */
  updateLink(
    tenantId: string, 
    linkId: string, 
    updates: UpdateBioLinkDto
  ): Observable<BioLink> {
    return this.http.put<BioLink>(`${this.baseUrl}/${tenantId}/links/${linkId}`, updates);
  }

  /**
   * Eliminar link
   */
  deleteLink(tenantId: string, linkId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tenantId}/links/${linkId}`);
  }

  /**
   * Activar/Desactivar link
   */
  toggleLinkActive(tenantId: string, linkId: string, isActive: boolean): Observable<BioLink> {
    return this.http.patch<BioLink>(
      `${this.baseUrl}/${tenantId}/links/${linkId}/toggle-active`, 
      { isActive }
    );
  }

  /**
   * Reordenar links
   */
  reorderLinks(tenantId: string, orderedIds: string[]): Observable<BioLink[]> {
    return this.http.patch<BioLink[]>(
      `${this.baseUrl}/${tenantId}/links/reorder`, 
      { orderedIds }
    );
  }

  /**
   * Obtener solo links activos (para web pública)
   */
  getActiveLinks(tenantId: string): Observable<BioLink[]> {
    return this.http.get<BioLink[]>(`${this.baseUrl}/${tenantId}/links/active`);
  }
}