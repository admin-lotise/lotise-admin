import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
    indicators = [
      { title: 'Total Rifas', value: 24, description: 'Rifas activas en el sistema' },
      { title: 'Usuarios', value: 1248, description: 'Usuarios registrados' },
      { title: 'Ingresos', value: '$45,890', description: 'Ingresos totales' },
      { title: 'Activos', value: 12, description: 'Usuarios activos' },
      { title: 'Indicador 1', value: 123, description: 'Descripción 1' },
      { title: 'Indicador 2', value: 456, description: 'Descripción 2' },
      { title: 'Indicador 3', value: 789, description: 'Descripción 3' },
      { title: 'Indicador 4', value: 101, description: 'Descripción 4' }
    ];
  ngAfterViewInit() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      // Quitar overflow hidden temporalmente
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        // Volver a poner overflow hidden
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }, 100);
    } else {
      // En web, conserva el overflow visible
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }
}
