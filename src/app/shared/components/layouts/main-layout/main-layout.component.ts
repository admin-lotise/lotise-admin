import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isSidebarExpanded = signal(true);
  isMobileMenuOpen = signal(false);
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ✅ Desktop Sidebar - Menú Principal
  readonly menuItems = [
    { 
      icon: 'dashboard', 
      label: 'Dashboard', 
      route: '/dashboard' 
    },
    { 
      icon: 'confirmation_number', 
      label: 'Rifas', 
      route: '/raffles' 
    },
    { 
      icon: 'group', 
      label: 'Contactos', 
      route: '/contacts' 
    },
    { 
      icon: 'credit_card', 
      label: 'Pagos', 
      route: '/payments' 
    },
    { 
      icon: 'analytics', 
      label: 'Analíticas', 
      route: '/analytics' 
    },
    { 
      icon: 'admin_panel_settings', 
      label: 'Usuarios Admin', 
      route: '/admin-users' 
    },
    // ===== SEPARADOR: CONFIGURACIÓN =====
    { 
      icon: 'business', 
      label: 'Mi Negocio', 
      route: '/settings/business-profile' 
    },
    { 
      icon: 'tune', 
      label: 'Config. Rifas', 
      route: '/settings/raffle-settings' 
    },
    { 
      icon: 'account_balance', 
      label: 'Métodos de Pago', 
      route: '/settings/payment-methods' 
    },
    { 
      icon: 'settings', 
      label: 'Configuración', 
      route: '/settings' 
    }
  ];

  // ✅ Mobile Bottom Nav - Solo 4 accesos principales
  readonly mobileBottomNavItems = [
    { 
      icon: 'home', 
      label: 'Inicio', 
      route: '/dashboard' 
    },
    { 
      icon: 'confirmation_number', 
      label: 'Rifas', 
      route: '/raffles' 
    },
    { 
      icon: 'add_circle', 
      label: 'Crear', 
      route: '/raffles/new'
    }
  ];

  // ✅ Mobile Sidebar - Menú Secundario (Bottom Sheet)
  readonly mobileSecondaryItems = [
    { 
      icon: 'confirmation_number', 
      label: 'Todas las Rifas', 
      description: 'Ver y gestionar rifas',
      route: '/raffles' 
    },
    { 
      icon: 'add_circle_outline', 
      label: 'Crear Nueva Rifa', 
      description: 'Agregar una rifa nueva',
      route: '/raffles/new' 
    },
    { 
      icon: 'group', 
      label: 'Contactos', 
      description: 'Gestiona tus clientes',
      route: '/contacts' 
    },
    { 
      icon: 'credit_card', 
      label: 'Pagos y Suscripción', 
      description: 'Gestiona tu plan',
      route: '/payments' 
    },
    { 
      icon: 'analytics', 
      label: 'Analíticas', 
      description: 'Reportes y estadísticas',
      route: '/analytics' 
    },
    { 
      icon: 'admin_panel_settings', 
      label: 'Usuarios Admin', 
      description: 'Gestiona administradores',
      route: '/admin-users' 
    },
    // ===== SEPARADOR: CONFIGURACIÓN =====
    { 
      icon: 'business', 
      label: 'Mi Negocio', 
      description: 'Información de tu empresa',
      route: '/settings/business-profile' 
    },
    { 
      icon: 'tune', 
      label: 'Configuración de Rifas', 
      description: 'Personaliza tus rifas',
      route: '/settings/raffle-settings' 
    },
    { 
      icon: 'account_balance', 
      label: 'Métodos de Pago', 
      description: 'Cuentas bancarias y tarjetas',
      route: '/settings/payment-methods' 
    },
    { 
      icon: 'settings', 
      label: 'Configuración', 
      description: 'Preferencias y ajustes',
      route: '/settings' 
    },
    { 
      icon: 'help', 
      label: 'Ayuda y Soporte', 
      description: 'Centro de ayuda',
      route: '/help' 
    }
  ];

  ngOnInit() {
    // Initialization logic
  }

  toggleSidebar() {
    this.isSidebarExpanded.update(value => !value);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  // ✅ Manejar click en items del mobile bottom nav
  handleMobileNavClick(item: any) {
    if (item.action === 'toggleMenu') {
      this.toggleMobileMenu();
    } else if (item.route) {
      this.router.navigate([item.route]);
      this.closeMobileMenu();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
