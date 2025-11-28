import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './shared/components/layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/auth/auth.guard';
import { UpdatePasswordLayoutComponent } from './shared/components/layouts/update-password-layout/update-password-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginLayoutComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'update-password',
    component: UpdatePasswordLayoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
