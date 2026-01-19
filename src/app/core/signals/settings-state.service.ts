import { Injectable, signal, computed } from '@angular/core';
import { 
  BusinessProfile, 
  WhatsAppContact, 
  SocialMedia, 
  ContactInfo,
  BioPage,
  HowItWorksSection,
  HowItWorksStep,
  TestimonialsSection,
  Testimonial,
  FaqsSection,
  FaqItem,
  ContactSection,
  BioLink,
  DEFAULT_BIO_PAGE
} from '../../shared/models/settings.model';

/**
 * Servicio de estado global para configuración con Angular Signals
 * Maneja el estado reactivo de toda la configuración del tenant (incluyendo Bio Page)
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsStateService {
  
  // ==================== BUSINESS PROFILE STATE ====================
  
  private readonly _businessProfile = signal<BusinessProfile>({
    businessName: '',
    aboutUs: '',
    logoUrl: null,
    whatsappContacts: [],
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      tiktok: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      scheduleText: ''
    }
  });

  private readonly _isLoadingBusinessProfile = signal(false);
  private readonly _businessProfileError = signal<string | null>(null);

  // Public readonly signals
  readonly businessProfile = this._businessProfile.asReadonly();
  readonly isLoadingBusinessProfile = this._isLoadingBusinessProfile.asReadonly();
  readonly businessProfileError = this._businessProfileError.asReadonly();

  // ✅ AGREGAR: Computed properties
  readonly whatsappContactsCount = computed(() => this._businessProfile().whatsappContacts.length);
  
  readonly hasSocialMedia = computed(() => {
    const social = this._businessProfile().socialMedia;
    return !!(social.facebook || social.instagram || social.twitter || social.tiktok);
  });

  // ==================== BIO PAGE STATE ====================

  private readonly _bioPage = signal<BioPage>({
    tenantId: '',
    howItWorks: DEFAULT_BIO_PAGE.howItWorks!,
    testimonials: DEFAULT_BIO_PAGE.testimonials!,
    faqs: DEFAULT_BIO_PAGE.faqs!,
    contact: DEFAULT_BIO_PAGE.contact!,
    backgroundColor: DEFAULT_BIO_PAGE.backgroundColor!,
    buttonColor: DEFAULT_BIO_PAGE.buttonColor!,
    buttonStyle: DEFAULT_BIO_PAGE.buttonStyle!,
    links: [],
    updatedAt: new Date()
  });

  private readonly _isLoadingBioPage = signal(false);
  private readonly _bioPageError = signal<string | null>(null);

  // Public readonly signals
  readonly bioPage = this._bioPage.asReadonly();
  readonly isLoadingBioPage = this._isLoadingBioPage.asReadonly();
  readonly bioPageError = this._bioPageError.asReadonly();

  // ==================== BUSINESS PROFILE METHODS ====================

  setBusinessProfile(profile: BusinessProfile): void {
    this._businessProfile.set(profile);
  }

  /**
   * Actualizar información general (nombre + aboutUs)
   */
  updateGeneralInfo(businessName: string, aboutUs: string): void {
    this._businessProfile.update(current => ({
      ...current,
      businessName,
      aboutUs
    }));
  }

  updateBusinessName(businessName: string): void {
    this._businessProfile.update(current => ({
      ...current,
      businessName
    }));
  }

  updateAboutUs(aboutUs: string): void {
    this._businessProfile.update(current => ({
      ...current,
      aboutUs
    }));
  }

  updateLogoUrl(logoUrl: string | null): void {
    this._businessProfile.update(current => ({
      ...current,
      logoUrl
    }));
  }

  updateSocialMedia(socialMedia: SocialMedia): void {
    this._businessProfile.update(current => ({
      ...current,
      socialMedia
    }));
  }

  updateContactInfo(contactInfo: ContactInfo): void {
    this._businessProfile.update(current => ({
      ...current,
      contactInfo
    }));
  }

  // WhatsApp Contacts
  addWhatsAppContact(contact: WhatsAppContact): void {
    this._businessProfile.update(current => ({
      ...current,
      whatsappContacts: [...current.whatsappContacts, contact]
    }));
  }

  updateWhatsAppContact(contactId: string, updatedContact: WhatsAppContact): void {
    this._businessProfile.update(current => ({
      ...current,
      whatsappContacts: current.whatsappContacts.map(c =>
        c.id === contactId ? updatedContact : c
      )
    }));
  }

  deleteWhatsAppContact(contactId: string): void {
    this._businessProfile.update(current => ({
      ...current,
      whatsappContacts: current.whatsappContacts.filter(c => c.id !== contactId)
    }));
  }

  // ✅ CORREGIR: Cambiar nombre del método
  setIsLoadingBusinessProfile(loading: boolean): void {
    this._isLoadingBusinessProfile.set(loading);
  }

  setBusinessProfileError(error: string | null): void {
    this._businessProfileError.set(error);
  }

  clearBusinessProfileError(): void {
    this._businessProfileError.set(null);
  }

  resetBusinessProfile(): void {
    this._businessProfile.set({
      businessName: '',
      aboutUs: '',
      logoUrl: null,
      whatsappContacts: [],
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        tiktok: ''
      },
      contactInfo: {
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        scheduleText: ''
      }
    });
    this._isLoadingBusinessProfile.set(false);
    this._businessProfileError.set(null);
  }

  // ==================== BIO PAGE METHODS ====================

  setBioPage(bioPage: BioPage): void {
    this._bioPage.set(bioPage);
  }

  setBioPageLoading(loading: boolean): void {
    this._isLoadingBioPage.set(loading);
  }

  setBioPageError(error: string | null): void {
    this._bioPageError.set(error);
  }

  clearBioPageError(): void {
    this._bioPageError.set(null);
  }

  // ==================== HOW IT WORKS METHODS ====================

  updateHowItWorksSection(section: HowItWorksSection): void {
    this._bioPage.update(current => ({
      ...current,
      howItWorks: section,
      updatedAt: new Date()
    }));
  }

  addHowItWorksStep(step: HowItWorksStep): void {
    this._bioPage.update(current => ({
      ...current,
      howItWorks: {
        ...current.howItWorks,
        steps: [...current.howItWorks.steps, step]
      },
      updatedAt: new Date()
    }));
  }

  updateHowItWorksStep(stepId: string, updatedStep: HowItWorksStep): void {
    this._bioPage.update(current => ({
      ...current,
      howItWorks: {
        ...current.howItWorks,
        steps: current.howItWorks.steps.map(s =>
          s.id === stepId ? updatedStep : s
        )
      },
      updatedAt: new Date()
    }));
  }

  deleteHowItWorksStep(stepId: string): void {
    this._bioPage.update(current => ({
      ...current,
      howItWorks: {
        ...current.howItWorks,
        steps: current.howItWorks.steps.filter(s => s.id !== stepId)
      },
      updatedAt: new Date()
    }));
  }

  reorderHowItWorksSteps(steps: HowItWorksStep[]): void {
    this._bioPage.update(current => ({
      ...current,
      howItWorks: {
        ...current.howItWorks,
        steps
      },
      updatedAt: new Date()
    }));
  }

  // ==================== TESTIMONIALS METHODS ====================

  updateTestimonialsSection(section: TestimonialsSection): void {
    this._bioPage.update(current => ({
      ...current,
      testimonials: section,
      updatedAt: new Date()
    }));
  }

  addTestimonial(testimonial: Testimonial): void {
    this._bioPage.update(current => ({
      ...current,
      testimonials: {
        ...current.testimonials,
        items: [...current.testimonials.items, testimonial]
      },
      updatedAt: new Date()
    }));
  }

  updateTestimonial(testimonialId: string, updatedTestimonial: Testimonial): void {
    this._bioPage.update(current => ({
      ...current,
      testimonials: {
        ...current.testimonials,
        items: current.testimonials.items.map(t =>
          t.id === testimonialId ? updatedTestimonial : t
        )
      },
      updatedAt: new Date()
    }));
  }

  deleteTestimonial(testimonialId: string): void {
    this._bioPage.update(current => ({
      ...current,
      testimonials: {
        ...current.testimonials,
        items: current.testimonials.items.filter(t => t.id !== testimonialId)
      },
      updatedAt: new Date()
    }));
  }

  reorderTestimonials(items: Testimonial[]): void {
    this._bioPage.update(current => ({
      ...current,
      testimonials: {
        ...current.testimonials,
        items
      },
      updatedAt: new Date()
    }));
  }

  // ==================== FAQS METHODS ====================

  updateFaqsSection(section: FaqsSection): void {
    this._bioPage.update(current => ({
      ...current,
      faqs: section,
      updatedAt: new Date()
    }));
  }

  addFaq(faq: FaqItem): void {
    this._bioPage.update(current => ({
      ...current,
      faqs: {
        ...current.faqs,
        items: [...current.faqs.items, faq]
      },
      updatedAt: new Date()
    }));
  }

  updateFaq(faqId: string, updatedFaq: FaqItem): void {
    this._bioPage.update(current => ({
      ...current,
      faqs: {
        ...current.faqs,
        items: current.faqs.items.map(f =>
          f.id === faqId ? updatedFaq : f
        )
      },
      updatedAt: new Date()
    }));
  }

  deleteFaq(faqId: string): void {
    this._bioPage.update(current => ({
      ...current,
      faqs: {
        ...current.faqs,
        items: current.faqs.items.filter(f => f.id !== faqId)
      },
      updatedAt: new Date()
    }));
  }

  reorderFaqs(items: FaqItem[]): void {
    this._bioPage.update(current => ({
      ...current,
      faqs: {
        ...current.faqs,
        items
      },
      updatedAt: new Date()
    }));
  }

  // ==================== CONTACT SECTION METHODS ====================

  updateContactSection(section: ContactSection): void {
    this._bioPage.update(current => ({
      ...current,
      contact: section,
      updatedAt: new Date()
    }));
  }

  // ==================== BIO LINKS METHODS ====================

  addBioLink(link: BioLink): void {
    this._bioPage.update(current => ({
      ...current,
      links: [...current.links, link],
      updatedAt: new Date()
    }));
  }

  updateBioLink(linkId: string, updatedLink: BioLink): void {
    this._bioPage.update(current => ({
      ...current,
      links: current.links.map(l =>
        l.id === linkId ? updatedLink : l
      ),
      updatedAt: new Date()
    }));
  }

  deleteBioLink(linkId: string): void {
    this._bioPage.update(current => ({
      ...current,
      links: current.links.filter(l => l.id !== linkId),
      updatedAt: new Date()
    }));
  }

  reorderBioLinks(links: BioLink[]): void {
    this._bioPage.update(current => ({
      ...current,
      links,
      updatedAt: new Date()
    }));
  }

  // ==================== APPEARANCE METHODS ====================

  updateBioPageAppearance(
    backgroundColor: string,
    buttonColor: string,
    buttonStyle: any
  ): void {
    this._bioPage.update(current => ({
      ...current,
      backgroundColor,
      buttonColor,
      buttonStyle,
      updatedAt: new Date()
    }));
  }

  // ==================== RESET ====================

  resetBioPage(): void {
    this._bioPage.set({
      tenantId: '',
      howItWorks: DEFAULT_BIO_PAGE.howItWorks!,
      testimonials: DEFAULT_BIO_PAGE.testimonials!,
      faqs: DEFAULT_BIO_PAGE.faqs!,
      contact: DEFAULT_BIO_PAGE.contact!,
      backgroundColor: DEFAULT_BIO_PAGE.backgroundColor!,
      buttonColor: DEFAULT_BIO_PAGE.buttonColor!,
      buttonStyle: DEFAULT_BIO_PAGE.buttonStyle!,
      links: [],
      updatedAt: new Date()
    });
    this._isLoadingBioPage.set(false);
    this._bioPageError.set(null);
  }

  resetAll(): void {
    this.resetBusinessProfile();
    this.resetBioPage();
  }
}