import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de administración de Lotise</p>
      
      <div class="dashboard-grid">
        <div class="stat-card">
          <h3>Total Rifas</h3>
          <p class="stat-number">24</p>
        </div>
        <div class="stat-card">
          <h3>Usuarios</h3>
          <p class="stat-number">1,248</p>
        </div>
        <div class="stat-card">
          <h3>Ingresos</h3>
          <p class="stat-number">$45,890</p>
        </div>
        <div class="stat-card">
          <h3>Activos</h3>
          <p class="stat-number">12</p>
        </div>
        <div class="stat-card">
          <h3>Indicador 1</h3>
          <p class="stat-number">123</p>
        </div>
        <div class="stat-card">
          <h3>Indicador 2</h3>
          <p class="stat-number">456</p>
        </div>
        <div class="stat-card">
          <h3>Indicador 3</h3>
          <p class="stat-number">789</p>
        </div>
        <div class="stat-card">
          <h3>Indicador 4</h3>
          <p class="stat-number">101</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      h1 {
        font-size: 2rem;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;

        @media (max-width: 768px) {
          font-size: 1.75rem;
        }

        @media (max-width: 480px) {
          font-size: 1.5rem;
        }
      }

      p {
        color: var(--color-text-secondary);
        margin-bottom: 2rem;

        @media (max-width: 768px) {
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
      }
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .stat-card {
      background: var(--color-bg-white);
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      transition: all var(--transition-fast);

      &:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        padding: 1.25rem;
      }

      @media (max-width: 480px) {
        padding: 1rem;
      }

      h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;

        @media (max-width: 480px) {
          font-size: 0.8125rem;
          margin-bottom: 0.5rem;
        }
      }

      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-primary);
        margin: 0;

        @media (max-width: 768px) {
          font-size: 1.75rem;
        }

        @media (max-width: 480px) {
          font-size: 1.5rem;
        }
      }
    }
  `]
})
export class DashboardComponent {}
