import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }
    const tenant = this.authService.getTenant();
    const requestedUrl = state.url;

    if (tenant?.isProvisionalPassword) {
      // Si tiene contraseña provisional, solo permite /update-password
      if (requestedUrl !== '/update-password') {
        return this.router.createUrlTree(['/update-password']);
      }
      return true;
    } else {
      // Si la contraseña ya fue actualizada, nunca permite /update-password
      if (requestedUrl === '/update-password') {
        return this.router.createUrlTree(['/dashboard']);
      }
      return true;
    }
  }
}
