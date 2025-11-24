import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

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
