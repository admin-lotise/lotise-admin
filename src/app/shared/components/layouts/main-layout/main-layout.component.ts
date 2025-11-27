import { Component, signal, Renderer2, inject, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

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
    private auth = inject(AuthService);
  
  isSidebarExpanded = signal(true);
  isMobileMenuOpen = signal(false);
  currentYear = new Date().getFullYear();

  constructor() {
    // Update theme-color and body background when mobile menu opens/closes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const themeColor = this.document.querySelector('meta[name="theme-color"]');
        const body = this.document.body;
        const rootStyles = getComputedStyle(this.document.documentElement);
        
        // Get colors from CSS variables
        const bgMain = rootStyles.getPropertyValue('--color-bg-main').trim();
        const bgFooter = rootStyles.getPropertyValue('--color-bg-footer').trim();
        
        if (this.isMobileMenuOpen()) {
          // Sidebar open - use bg-main for header/top, footer color for bottom
          if (themeColor) themeColor.setAttribute('content', bgMain);
          if (body) body.style.backgroundColor = bgFooter;
        } else {
          // Sidebar closed - use footer color
          if (themeColor) themeColor.setAttribute('content', bgFooter);
          if (body) body.style.backgroundColor = bgFooter;
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

  // Desktop sidebar items (todos los items)
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'confirmation_number', label: 'Rifas', route: '/raffles' },
    { icon: 'groups', label: 'Contactos', route: '/contacts' },
    { icon: 'credit_card', label: 'Pagos', route: '/payments' },
    { icon: 'bar_chart', label: 'Analíticas', route: '/analytics' },
    { icon: 'admin_panel_settings', label: 'Usuarios Admin', route: '/admin-users' },
    { icon: 'settings', label: 'Configuración', route: '/settings' }
  ];

  // Mobile bottom navigation (4 items principales)
  mobileBottomNavItems = [
    { icon: 'home', label: 'Inicio', route: '/dashboard' },
    { icon: 'add', label: 'Crear Rifa', route: '/raffles/create' },
    { icon: 'credit_card', label: 'Pagos', route: '/payments' }
  ];

  // Mobile sidebar secondary items (resto de opciones)
  mobileSecondaryItems = [
    { icon: 'confirmation_number', label: 'Rifas', description: 'Administra tus rifas', route: '/raffles' },
    { icon: 'groups', label: 'Contactos', description: 'Lista de contactos', route: '/contacts' },
    { icon: 'bar_chart', label: 'Analíticas', description: 'Reportes y estadísticas', route: '/analytics' },
    { icon: 'admin_panel_settings', label: 'Usuarios Admin', description: 'Gestión de administradores', route: '/admin-users' },
    { icon: 'settings', label: 'Configuración', description: 'Ajustes del sistema', route: '/settings' }
  ];
  logout(): void {
    this.auth.logout();
    this.closeMobileMenu();
  }
}
