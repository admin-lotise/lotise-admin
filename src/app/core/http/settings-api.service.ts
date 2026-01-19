import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { 
  BusinessProfile, 
  WhatsAppContact, 
  SocialMedia,
  ContactInfo,
  BioPage,
  HowItWorksSection,
  HowItWorksStep,
  CreateHowItWorksStepDto,
  UpdateHowItWorksStepDto,
  TestimonialsSection,
  Testimonial,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  FaqsSection,
  FaqItem,
  CreateFaqDto,
  UpdateFaqDto,
  ContactSection,
  UpdateContactSectionDto,
  BioLink,
  CreateBioLinkDto,
  UpdateBioLinkDto,
  UpdateBioPageDto,
  DEFAULT_BIO_PAGE,
  FileUploadRequest,
  FileUploadResponse 
} from '../../shared/models/settings.model';
import { environment } from '../../environments/environment';

/**
 * Servicio para comunicación con API de configuración
 * Por ahora retorna datos mock hasta que el backend esté listo
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  // Flag para usar datos mock (cambiar a false cuando el backend esté listo)
  private readonly USE_MOCK_DATA = true;

  // ==================== BUSINESS PROFILE ENDPOINTS ====================

  /**
   * Obtener perfil del negocio del tenant
   */
  getBusinessProfile(tenantId: string): Observable<BusinessProfile> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBusinessProfile();
    }

    return this.http.get<BusinessProfile>(
      `${this.apiUrl}/tenants/${tenantId}/settings/business-profile`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar información general (nombre + aboutUs)
   */
  updateGeneralInfo(tenantId: string, businessName: string, aboutUs: string): Observable<BusinessProfile> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBusinessProfile().pipe(
        map(profile => ({ ...profile, businessName, aboutUs })),
        delay(800)
      );
    }

    return this.http.patch<BusinessProfile>(
      `${this.apiUrl}/tenants/${tenantId}/settings/business-profile/general`,
      { businessName, aboutUs }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar nombre del negocio
   */
  updateBusinessName(tenantId: string, businessName: string): Observable<BusinessProfile> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBusinessProfile().pipe(
        map(profile => ({ ...profile, businessName })),
        delay(500)
      );
    }

    return this.http.patch<BusinessProfile>(
      `${this.apiUrl}/tenants/${tenantId}/settings/business-profile/name`,
      { businessName }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar sección "Acerca de nosotros"
   */
  updateAboutUs(tenantId: string, aboutUs: string): Observable<BusinessProfile> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBusinessProfile().pipe(
        map(profile => ({ ...profile, aboutUs })),
        delay(500)
      );
    }

    return this.http.patch<BusinessProfile>(
      `${this.apiUrl}/tenants/${tenantId}/settings/business-profile/about`,
      { aboutUs }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Subir logo (preparado para S3)
   * Por ahora retorna URL mock, después implementar upload a S3
   */
  uploadLogo(request: FileUploadRequest): Observable<FileUploadResponse> {
    if (this.USE_MOCK_DATA) {
      return of({
        success: true,
        url: 'https://via.placeholder.com/200',
        message: 'Logo subido correctamente (mock)'
      }).pipe(delay(1500));
    }

    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('tenantId', request.tenantId);
    formData.append('fileType', request.fileType);

    return this.http.post<FileUploadResponse>(
      `${this.apiUrl}/upload/logo`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar logo
   */
  deleteLogo(tenantId: string): Observable<BusinessProfile> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBusinessProfile().pipe(
        map(profile => ({ ...profile, logoUrl: null })),
        delay(500)
      );
    }

    return this.http.delete<BusinessProfile>(
      `${this.apiUrl}/tenants/${tenantId}/settings/business-profile/logo`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== WHATSAPP CONTACTS ENDPOINTS ====================

  /**
   * Crear contacto de WhatsApp
   */
  createWhatsAppContact(tenantId: string, contact: Partial<WhatsAppContact>): Observable<WhatsAppContact> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: `mock-${Date.now()}`,
        countryCode: contact.countryCode!,
        number: contact.number!,
        useForReservations: contact.useForReservations!,
        visibleOnWeb: contact.visibleOnWeb!,
        createdAt: new Date().toISOString()
      }).pipe(delay(800));
    }

    return this.http.post<WhatsAppContact>(
      `${this.apiUrl}/tenants/${tenantId}/settings/whatsapp-contacts`,
      contact
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar contacto de WhatsApp
   */
  updateWhatsAppContact(tenantId: string, contactId: string, contact: Partial<WhatsAppContact>): Observable<WhatsAppContact> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: contactId,
        countryCode: contact.countryCode!,
        number: contact.number!,
        useForReservations: contact.useForReservations!,
        visibleOnWeb: contact.visibleOnWeb!,
        createdAt: new Date().toISOString()
      }).pipe(delay(800));
    }

    return this.http.put<WhatsAppContact>(
      `${this.apiUrl}/tenants/${tenantId}/settings/whatsapp-contacts/${contactId}`,
      contact
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar contacto de WhatsApp
   */
  deleteWhatsAppContact(tenantId: string, contactId: string): Observable<void> {
    if (this.USE_MOCK_DATA) {
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/tenants/${tenantId}/settings/whatsapp-contacts/${contactId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== SOCIAL MEDIA ENDPOINTS ====================

  /**
   * Actualizar redes sociales
   */
  updateSocialMedia(tenantId: string, socialMedia: SocialMedia): Observable<SocialMedia> {
    if (this.USE_MOCK_DATA) {
      return of(socialMedia).pipe(delay(800));
    }

    return this.http.put<SocialMedia>(
      `${this.apiUrl}/tenants/${tenantId}/settings/social-media`,
      socialMedia
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== CONTACT INFO ENDPOINTS ====================

  /**
   * Actualizar información de contacto general
   */
  updateContactInfo(tenantId: string, contactInfo: Partial<ContactInfo>): Observable<ContactInfo> {
    if (this.USE_MOCK_DATA) {
      return of(contactInfo as ContactInfo).pipe(delay(800));
    }

    return this.http.put<ContactInfo>(
      `${this.apiUrl}/tenants/${tenantId}/settings/contact-info`,
      contactInfo
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== BIO PAGE ENDPOINTS ====================

  /**
   * Obtener página de biografía
   */
  getBioPage(tenantId: string): Observable<BioPage> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBioPage(tenantId);
    }

    return this.http.get<BioPage>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar página de biografía
   */
  updateBioPage(tenantId: string, updates: UpdateBioPageDto): Observable<BioPage> {
    if (this.USE_MOCK_DATA) {
      return this.getMockBioPage(tenantId).pipe(
        map(bioPage => ({ ...bioPage, ...updates, updatedAt: new Date() })),
        delay(800)
      );
    }

    return this.http.patch<BioPage>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page`,
      updates
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== HOW IT WORKS ENDPOINTS ====================

  /**
   * Actualizar sección "Cómo funciona"
   */
  updateHowItWorksSection(tenantId: string, section: HowItWorksSection): Observable<HowItWorksSection> {
    if (this.USE_MOCK_DATA) {
      return of(section).pipe(delay(800));
    }

    return this.http.put<HowItWorksSection>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/how-it-works`,
      section
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear paso en sección "Cómo funciona"
   */
  createHowItWorksStep(tenantId: string, step: CreateHowItWorksStepDto): Observable<HowItWorksStep> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: `step-${Date.now()}`,
        ...step
      }).pipe(delay(500));
    }

    return this.http.post<HowItWorksStep>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/how-it-works/steps`,
      step
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar paso en sección "Cómo funciona"
   */
  updateHowItWorksStep(tenantId: string, stepId: string, step: UpdateHowItWorksStepDto): Observable<HowItWorksStep> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: stepId,
        order: step.order || 1,
        icon: step.icon || '',
        title: step.title || '',
        description: step.description || ''
      }).pipe(delay(500));
    }

    return this.http.patch<HowItWorksStep>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/how-it-works/steps/${stepId}`,
      step
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar paso de sección "Cómo funciona"
   */
  deleteHowItWorksStep(tenantId: string, stepId: string): Observable<void> {
    if (this.USE_MOCK_DATA) {
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/how-it-works/steps/${stepId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Reordenar pasos en sección "Cómo funciona"
   */
  reorderHowItWorksSteps(tenantId: string, steps: HowItWorksStep[]): Observable<HowItWorksStep[]> {
    if (this.USE_MOCK_DATA) {
      return of(steps).pipe(delay(500));
    }

    return this.http.put<HowItWorksStep[]>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/how-it-works/steps/reorder`,
      { steps }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== TESTIMONIALS ENDPOINTS ====================

  /**
   * Actualizar sección de testimoniales
   */
  updateTestimonialsSection(tenantId: string, section: TestimonialsSection): Observable<TestimonialsSection> {
    if (this.USE_MOCK_DATA) {
      return of(section).pipe(delay(800));
    }

    return this.http.put<TestimonialsSection>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/testimonials`,
      section
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear nuevo testimonio
   */
  createTestimonial(tenantId: string, testimonial: CreateTestimonialDto): Observable<Testimonial> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: `testimonial-${Date.now()}`,
        ...testimonial
      }).pipe(delay(500));
    }

    return this.http.post<Testimonial>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/testimonials/items`,
      testimonial
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar testimonio
   */
  updateTestimonial(tenantId: string, testimonialId: string, testimonial: UpdateTestimonialDto): Observable<Testimonial> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: testimonialId,
        order: testimonial.order || 1,
        name: testimonial.name || '',
        message: testimonial.message || '',
        rating: testimonial.rating || 5,
        avatarUrl: testimonial.avatarUrl,
        prize: testimonial.prize,
        date: testimonial.date
      }).pipe(delay(500));
    }

    return this.http.patch<Testimonial>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/testimonials/items/${testimonialId}`,
      testimonial
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar testimonio
   */
  deleteTestimonial(tenantId: string, testimonialId: string): Observable<void> {
    if (this.USE_MOCK_DATA) {
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/testimonials/items/${testimonialId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Reordenar testimoniales
   */
  reorderTestimonials(tenantId: string, items: Testimonial[]): Observable<Testimonial[]> {
    if (this.USE_MOCK_DATA) {
      return of(items).pipe(delay(500));
    }

    return this.http.put<Testimonial[]>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/testimonials/items/reorder`,
      { items }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== FAQS ENDPOINTS ====================

  /**
   * Actualizar sección de FAQs
   */
  updateFaqsSection(tenantId: string, section: FaqsSection): Observable<FaqsSection> {
    if (this.USE_MOCK_DATA) {
      return of(section).pipe(delay(800));
    }

    return this.http.put<FaqsSection>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/faqs`,
      section
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear nueva FAQ
   */
  createFaq(tenantId: string, faq: CreateFaqDto): Observable<FaqItem> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: `faq-${Date.now()}`,
        ...faq
      }).pipe(delay(500));
    }

    return this.http.post<FaqItem>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/faqs/items`,
      faq
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar FAQ
   */
  updateFaq(tenantId: string, faqId: string, faq: UpdateFaqDto): Observable<FaqItem> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: faqId,
        order: faq.order || 1,
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category
      }).pipe(delay(500));
    }

    return this.http.patch<FaqItem>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/faqs/items/${faqId}`,
      faq
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar FAQ
   */
  deleteFaq(tenantId: string, faqId: string): Observable<void> {
    if (this.USE_MOCK_DATA) {
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/faqs/items/${faqId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Reordenar FAQs
   */
  reorderFaqs(tenantId: string, items: FaqItem[]): Observable<FaqItem[]> {
    if (this.USE_MOCK_DATA) {
      return of(items).pipe(delay(500));
    }

    return this.http.put<FaqItem[]>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/faqs/items/reorder`,
      { items }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== CONTACT SECTION ENDPOINTS ====================

  /**
   * Actualizar sección de contacto
   */
  updateContactSection(tenantId: string, section: UpdateContactSectionDto): Observable<ContactSection> {
    if (this.USE_MOCK_DATA) {
      return of(section as ContactSection).pipe(delay(800));
    }

    return this.http.patch<ContactSection>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/contact`,
      section
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== BIO LINKS ENDPOINTS ====================

  /**
   * Crear nuevo enlace biográfico
   */
  createBioLink(tenantId: string, link: CreateBioLinkDto): Observable<BioLink> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: `link-${Date.now()}`,
        ...link
      }).pipe(delay(500));
    }

    return this.http.post<BioLink>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/links`,
      link
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar enlace biográfico
   */
  updateBioLink(tenantId: string, linkId: string, link: UpdateBioLinkDto): Observable<BioLink> {
    if (this.USE_MOCK_DATA) {
      return of({
        id: linkId,
        title: link.title || '',
        url: link.url || '',
        icon: link.icon,
        order: link.order || 1,
        isActive: link.isActive ?? true
      }).pipe(delay(500));
    }

    return this.http.patch<BioLink>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/links/${linkId}`,
      link
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar enlace biográfico
   */
  deleteBioLink(tenantId: string, linkId: string): Observable<void> {
    if (this.USE_MOCK_DATA) {
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/links/${linkId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Reordenar enlaces biográficos
   */
  reorderBioLinks(tenantId: string, links: BioLink[]): Observable<BioLink[]> {
    if (this.USE_MOCK_DATA) {
      return of(links).pipe(delay(500));
    }

    return this.http.put<BioLink[]>(
      `${this.apiUrl}/tenants/${tenantId}/bio-page/links/reorder`,
      { links }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== MOCK DATA ====================

  private getMockBusinessProfile(): Observable<BusinessProfile> {
    return of({
      businessName: 'Rifas El Búfalo',
      aboutUs: '<p>Somos una empresa dedicada a las rifas desde hace más de 10 años...</p>',
      logoUrl: 'https://via.placeholder.com/150',
      whatsappContacts: [],
      socialMedia: {
        facebook: 'https://facebook.com/rifaselbufalo',
        twitter: 'https://twitter.com/rifaselbufalo',
        instagram: 'https://instagram.com/rifaselbufalo',
        tiktok: ''
      },
      contactInfo: {
        email: 'contacto@rifaselbufalo.com',
        phone: '+52 81 1234 5678',
        whatsapp: '+52 81 8765 4321',
        address: 'Av. Ejemplo 123, Monterrey, NL',
        scheduleText: 'Lunes a Viernes: 9:00 AM - 6:00 PM\nSábados: 9:00 AM - 2:00 PM'
      }
    }).pipe(delay(1000));
  }

  private getMockBioPage(tenantId: string): Observable<BioPage> {
    return of({
      tenantId,
      howItWorks: DEFAULT_BIO_PAGE.howItWorks!,
      testimonials: DEFAULT_BIO_PAGE.testimonials!,
      faqs: DEFAULT_BIO_PAGE.faqs!,
      contact: DEFAULT_BIO_PAGE.contact!,
      backgroundColor: DEFAULT_BIO_PAGE.backgroundColor!,
      buttonColor: DEFAULT_BIO_PAGE.buttonColor!,
      buttonStyle: DEFAULT_BIO_PAGE.buttonStyle!,
      links: [],
      updatedAt: new Date()
    }).pipe(delay(1000));
  }

  // ==================== ERROR HANDLER ====================

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}