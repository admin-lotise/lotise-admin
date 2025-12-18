import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './shared/components/layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/auth/auth.guard';
import { UpdatePasswordLayoutComponent } from './shared/components/layouts/update-password-layout/update-password-layout.component';
import { BusinessProfileComponent } from './features/settings/business-profile/business-profile.component';

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
        component: DashboardComponent
      },
      // ✅ NUEVA RUTA: Business Profile
      {
        path: 'settings/business-profile',
        component: BusinessProfileComponent
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
