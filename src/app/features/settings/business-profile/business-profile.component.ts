import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsStateService } from '../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../core/http/settings-api.service';
import { StorageService } from '../../../core/auth/storage.service';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { ContactNumbersComponent } from './contact-numbers/contact-numbers.component';
import { SocialMediaComponent } from './social-media/social-media.component';

/**
 * Componente principal para gestión de perfil de negocio
 * Contiene tabs para: Datos Generales, Contactos y Redes Sociales
 */
@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [
    CommonModule,
    GeneralInfoComponent,
    ContactNumbersComponent,
    SocialMediaComponent
  ],
  templateUrl: './business-profile.component.html',
  styleUrl: './business-profile.component.scss'
})
export class BusinessProfileComponent implements OnInit {
  // ✅ CORREGIDO: settingsState debe ser público para usarlo en el template
  readonly settingsState = inject(SettingsStateService);
  
  // Estos pueden seguir siendo private porque solo se usan en el .ts
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  // Signals locales
  readonly activeTab = signal<'general' | 'contacts' | 'social'>('general');
  readonly isInitialLoad = signal(true);

  // Signals del estado global (para template)
  readonly businessProfile = this.settingsState.businessProfile;
  readonly isLoading = this.settingsState.isLoadingBusinessProfile;
  readonly error = this.settingsState.businessProfileError;

  ngOnInit(): void {
    this.loadBusinessProfile();
  }

  /**
   * Cargar perfil del negocio desde API
   */
  private loadBusinessProfile(): void {
    const tenant = this.storageService.getTenant();
    
    if (!tenant) {
      console.error('No hay tenant en sesión');
      this.router.navigate(['/login']);
      return;
    }

    this.settingsState.setLoadingBusinessProfile(true);
    this.settingsState.clearBusinessProfileError();

    this.settingsApi.getBusinessProfile(tenant.tenantId).subscribe({
      next: (profile) => {
        this.settingsState.updateBusinessProfile(profile);
        this.settingsState.setLoadingBusinessProfile(false);
        this.isInitialLoad.set(false);
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.settingsState.setBusinessProfileError('Error al cargar los datos del perfil');
        this.settingsState.setLoadingBusinessProfile(false);
        this.isInitialLoad.set(false);
      }
    });
  }

  /**
   * Cambiar tab activo
   */
  changeTab(tab: 'general' | 'contacts' | 'social'): void {
    this.activeTab.set(tab);
  }

  /**
   * Recargar datos
   */
  reloadData(): void {
    this.loadBusinessProfile();
  }
}