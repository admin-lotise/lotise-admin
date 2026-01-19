import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsStateService } from '../../../core/signals/settings-state.service';
import { SettingsApiService } from '../../../core/http/settings-api.service';
import { StorageService } from '../../../core/auth/storage.service';

// Business Profile Components
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { ContactNumbersComponent } from './components/contact-numbers/contact-numbers.component'; // ✅ CORREGIDO
import { SocialMediaComponent } from './components/social-media/social-media.component'; // ✅ CORREGIDO

// Bio Page Components
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { PreviewComponent } from './components/preview/preview.component';

type TabType = 'general' | 'contacts' | 'social' | 'bio-contact' | 'bio-how' | 'bio-testimonials' | 'bio-faqs' | 'bio-preview';

/**
 * Componente principal para gestión de perfil de negocio y Bio Page
 * Contiene tabs para: Datos Generales, Contactos, Redes Sociales y Bio Page
 */
@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [
    CommonModule,
    // Business Profile
    GeneralInfoComponent,
    ContactNumbersComponent,
    SocialMediaComponent,
    // Bio Page
    ContactInfoComponent,
    HowItWorksComponent,
    TestimonialsComponent,
    FaqsComponent,
    PreviewComponent
  ],
  templateUrl: './business-profile.component.html',
  styleUrl: './business-profile.component.scss'
})
export class BusinessProfileComponent implements OnInit {
  readonly settingsState = inject(SettingsStateService);
  private readonly settingsApi = inject(SettingsApiService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  // Signals locales
  readonly activeTab = signal<TabType>('general');
  readonly isInitialLoad = signal(true);

  // Signals del estado global
  readonly businessProfile = this.settingsState.businessProfile;
  readonly bioPage = this.settingsState.bioPage;
  readonly isLoading = this.settingsState.isLoadingBusinessProfile;
  readonly error = this.settingsState.businessProfileError;

  // Computed: Contadores para badges
  readonly activeBioSectionsCount = computed(() => {
    const bio = this.bioPage();
    let count = 0;
    if (bio.contact.enabled) count++;
    if (bio.howItWorks.enabled) count++;
    if (bio.testimonials.enabled) count++;
    if (bio.faqs.enabled) count++;
    return count;
  });

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Cargar datos desde API
   */
  private loadData(): void {
    const tenant = this.storageService.getTenant();
    
    if (!tenant) {
      console.error('No hay tenant en sesión');
      this.router.navigate(['/login']);
      return;
    }

    this.settingsState.setIsLoadingBusinessProfile(true);
    this.settingsState.clearBusinessProfileError();

    // ✅ Cargar Bio Page
    this.settingsState.setBioPageLoading(true);

    // Cargar Business Profile
    this.settingsApi.getBusinessProfile(tenant.tenantId).subscribe({
      next: (profile) => {
        this.settingsState.setBusinessProfile(profile);
        this.settingsState.setIsLoadingBusinessProfile(false);
        this.isInitialLoad.set(false);
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.settingsState.setBusinessProfileError('Error al cargar los datos del perfil');
        this.settingsState.setIsLoadingBusinessProfile(false);
        this.isInitialLoad.set(false);
      }
    });

    // ✅ Cargar Bio Page (tiene testimonials, faqs, etc.)
    this.settingsApi.getBioPage(tenant.tenantId).subscribe({
      next: (bioPage) => {
        console.log('✅ Bio Page cargada:', bioPage);
        this.settingsState.setBioPage(bioPage);
        this.settingsState.setBioPageLoading(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar Bio Page:', error);
        this.settingsState.setBioPageError('Error al cargar la Bio Page');
        this.settingsState.setBioPageLoading(false);
      }
    });
  }

  /**
   * Cambiar tab activo
   */
  changeTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  /**
   * Recargar datos
   */
  reloadData(): void {
    this.isInitialLoad.set(false); // No mostrar loading completo
    this.loadData();
  }
}