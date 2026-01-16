import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LegalContent, MOCK_LEGAL_CONTENT } from '../../../shared/models/legal-content.model';

@Component({
  selector: 'app-legal-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-content.component.html',
  styleUrl: './legal-content.component.scss'
})
export class LegalContentComponent {
  // State
  legalContent = signal<LegalContent>(MOCK_LEGAL_CONTENT);

  constructor(private router: Router) {}

  // Navigate to editors
  editPrivacyPolicy(): void {
    this.router.navigate(['/settings/legal-content/privacy-policy']);
  }

  editTermsConditions(): void {
    this.router.navigate(['/settings/legal-content/terms-conditions']);
  }

  // Check if content exists
  hasPrivacyPolicy(): boolean {
    return !!this.legalContent().privacyPolicyHtml?.trim();
  }

  hasTermsConditions(): boolean {
    return !!this.legalContent().termsConditionsHtml?.trim();
  }

  // Get preview text (strip HTML)
  getPrivacyPreview(): string {
    const html = this.legalContent().privacyPolicyHtml || '';
    const text = this.stripHtml(html);
    return text.substring(0, 200);
  }

  getTermsPreview(): string {
    const html = this.legalContent().termsConditionsHtml || '';
    const text = this.stripHtml(html);
    return text.substring(0, 200);
  }

  // Strip HTML tags
  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Preview in modal/new tab
  previewPrivacyPolicy(): void {
    const content = this.legalContent().privacyPolicyHtml;
    if (content) {
      this.openPreview('Política de Privacidad', content);
    }
  }

  previewTermsConditions(): void {
    const content = this.legalContent().termsConditionsHtml;
    if (content) {
      this.openPreview('Términos y Condiciones', content);
    }
  }

  private openPreview(title: string, content: string): void {
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              color: #333;
            }
            h1 { color: #ff497c; border-bottom: 2px solid #ff497c; padding-bottom: 0.5rem; }
            h2 { color: #333; margin-top: 2rem; }
            h3 { color: #666; }
            ul { padding-left: 1.5rem; }
            li { margin: 0.5rem 0; }
            p { margin: 1rem 0; }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  }
}