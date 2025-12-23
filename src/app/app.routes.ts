import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './shared/components/layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { AuthGuard } from './core/auth/auth.guard';
import { UpdatePasswordLayoutComponent } from './shared/components/layouts/update-password-layout/update-password-layout.component';

export const routes: Routes = [
  // 🔓 Ruta pública: Login
  {
    path: 'login',
    component: LoginLayoutComponent
  },
  
  // 🔐 Rutas protegidas: Dentro de MainLayoutComponent
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
        path: 'settings',
        children: [
          {
            path: 'business-profile',
            loadComponent: () => import('./features/settings/business-profile/business-profile.component').then(m => m.BusinessProfileComponent)
          },
          {
            path: 'payment-methods',
            loadComponent: () => import('./features/settings/payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent)
          },
          {
            path: 'raffle-settings',
            loadComponent: () => import('./features/settings/raffle-settings/raffle-settings.component').then(m => m.RaffleSettingsComponent)
          }
        ]
      },
      // ✅ NUEVO: Rutas de rifas
      {
        path: 'raffles',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/raffles/raffles.component').then(m => m.RafflesComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/raffles/raffle-form/raffle-form.component').then(m => m.RaffleFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/raffles/raffle-detail/raffle-detail.component').then(m => m.RaffleDetailComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/raffles/raffle-form/raffle-form.component').then(m => m.RaffleFormComponent)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // 🔓 Update Password (Sin AuthGuard porque es parte del flujo inicial)
  {
    path: 'update-password',
    component: UpdatePasswordLayoutComponent
  },
  
  // ⚠️ Fallback: Cualquier ruta no encontrada
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
