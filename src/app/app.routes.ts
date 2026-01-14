import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginLayoutComponent } from './shared/components/layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { UpdatePasswordLayoutComponent } from './shared/components/layouts/update-password-layout/update-password-layout.component';

export const routes: Routes = [
  // Login (sin guardia)
  {
    path: 'login',
    component: LoginLayoutComponent
  },

  // Update Password
  {
    path: 'update-password',
    component: UpdatePasswordLayoutComponent,
    canActivate: [AuthGuard]
  },

  // Layout principal con rutas hijas
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'raffles',
        loadComponent: () => import('./features/raffles/raffles.component').then(m => m.RafflesComponent)
      },
      {
        path: 'raffles/new',
        loadComponent: () => import('./features/raffles/raffle-form/raffle-form.component').then(m => m.RaffleFormComponent)
      },
      {
        path: 'raffles/:id',
        loadComponent: () => import('./features/raffles/raffle-detail/raffle-detail.component').then(m => m.RaffleDetailComponent)
      },
      {
        path: 'raffles/:id/edit',
        loadComponent: () => import('./features/raffles/raffle-form/raffle-form.component').then(m => m.RaffleFormComponent)
      },
      {
        path: 'raffles/:id/tickets',
        loadComponent: () => import('./features/raffles/ticket-manager/ticket-manager.component').then(m => m.TicketManagerComponent)
      },
      {
        path: 'settings/business-profile',
        loadComponent: () => import('./features/settings/business-profile/business-profile.component').then(m => m.BusinessProfileComponent)
      },
      {
        path: 'settings/raffle-settings',
        loadComponent: () => import('./features/settings/raffle-settings/raffle-settings.component').then(m => m.RaffleSettingsComponent)
      },
      {
        path: 'settings/payment-methods',
        loadComponent: () => import('./features/settings/payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent)
      },
      // ==================== NUEVO: WhatsApp Templates ====================
      {
        path: 'settings/whatsapp-templates',
        loadComponent: () => import('./features/settings/whatsapp-templates/whatsapp-templates.component').then(m => m.WhatsappTemplatesComponent)
      },
      {
        path: 'settings/whatsapp-templates/editor/:id',
        loadComponent: () => import('./features/settings/whatsapp-templates/template-editor/template-editor.component').then(m => m.TemplateEditorComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Wildcard redirect
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
