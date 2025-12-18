import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Interceptor funcional para agregar token de autenticación
 * y manejar errores 401 (Unauthorized)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {  
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ Lista de endpoints públicos (sin token)
  const publicEndpoints = [
    '/tenants/login',
    '/tenants/register',
    '/tenants/forgot-password',
    '/tenants/reset-password',
  ];

  // ✅ Si es endpoint público, NO agregar token
  const isPublic = publicEndpoints.some(endpoint => req.url.includes(endpoint));
  
  if (isPublic) {
    return next(req);
  }

  // ✅ Obtener token del storage
  const token = authService.getAccessToken();
  
  // ✅ Si NO hay token, redirigir a login
  if (!token) {
    console.warn('⚠️ No hay token disponible. Redirigiendo a /login');
    router.navigate(['/login']);
    return throwError(() => new Error('No hay token de autenticación'));
  }

  // ✅ Clonar request y agregar header Authorization
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // ✅ Enviar request con token y manejar errores
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // ✅ Si es 401 (Unauthorized), limpiar sesión y redirigir
      if (error.status === 401) {
        authService.logout();
        return throwError(() => new Error('Sesión expirada. Por favor inicia sesión nuevamente.'));
      }

      // ✅ Si es 403 (Forbidden), mostrar mensaje de permisos
      if (error.status === 403) {
        return throwError(() => new Error('No tienes permisos para realizar esta acción.'));
      }

      // ✅ Para otros errores, reenviar el error original
      return throwError(() => error);
    })
  );
};