import { Component, signal, Renderer2, inject, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  
  isSidebarExpanded = signal(true);
  isMobileMenuOpen = signal(false);
  currentYear = new Date().getFullYear();

  constructor() {
    // Update theme-color and body background when mobile menu opens/closes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const themeColor = this.document.querySelector('meta[name="theme-color"]');
        const body = this.document.body;
        
        if (this.isMobileMenuOpen()) {
          // Sidebar open - use sidebar color for header, footer color for bottom
          if (themeColor) themeColor.setAttribute('content', '#1e3a5f');
          if (body) {
            body.style.background = 'linear-gradient(to bottom, #1e3a5f 0%, #1e3a5f calc(100% - 80px), #152942 calc(100% - 80px), #152942 100%)';
          }
        } else {
          // Sidebar closed - use main content color for top, footer color for bottom
          if (themeColor) themeColor.setAttribute('content', '#f8fafc');
          if (body) {
            body.style.background = 'linear-gradient(to bottom, #f8fafc 0%, #f8fafc calc(100% - 80px), #152942 calc(100% - 80px), #152942 100%)';
          }
        }
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarExpanded.update(value => !value);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  menuItems = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { icon: '🎟️', label: 'Rifas', route: '/raffles' },
    { icon: '👥', label: 'Contactos', route: '/contacts' },
    { icon: '💳', label: 'Pagos', route: '/payments' },
    { icon: '📈', label: 'Analíticas', route: '/analytics' },
    { icon: '👤', label: 'Usuarios Admin', route: '/admin-users' },
    { icon: '⚙️', label: 'Configuración', route: '/settings' }
  ];
}
