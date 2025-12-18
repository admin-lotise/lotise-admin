import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StorageService, Tenant, AuthUser } from './storage.service';
import { environment } from '../../environments/environment';

/**
 * Interface para credenciales de login
 */
export interface LoginCredentials {
  login: string;
  password: string;
}

/**
 * Interface para la respuesta de login
 */
export interface LoginResponse {
  token: string;
  tenant: Tenant;
}

// ✅ Interface para la respuesta
interface UpdatePasswordResponse {
  message: string;
  result: {
    token: string;
    tenant: {
      tenantId: string;
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      subscriptionStatus: string;
      stripeCustomerId: string;
      planId: string;
      planName: string;
      planType: string;
      priceAmount: number;
      stripeSubscriptionId: string;
      subscriptionItemId: string;
      createdAt: string;
      updatedAt: string;
      domain: string | null;
      isProvisionalPassword: boolean;
    };
  };
}

/**
 * Servicio de autenticación
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  private readonly API_URL = environment.apiUrl;
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  /**
   * Login de usuario
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/tenants/login`, credentials).pipe(
      tap(response => {
        console.log('✅ Login Response:', response);
        
        if (response.token && response.tenant) {
          this.storage.setToken(response.token);
          this.storage.setTenant(response.tenant);
          this.isAuthenticatedSubject.next(true);
          
          console.log('✅ Token guardado:', this.storage.getToken());
          console.log('✅ Tenant guardado:', this.storage.getTenant());
          console.log('✅ isProvisionalPassword:', response.tenant.isProvisionalPassword);
        }
      }),
      catchError(error => {
        console.error('❌ Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar contraseña (contraseña provisional)
   * ✅ CORREGIDO: Cambiar a PUT y solo enviar tenantId + newPassword
   */
  updatePassword(newPassword: string): Observable<UpdatePasswordResponse> {
    const tenant = this.getTenant();
    
    if (!tenant || !tenant.tenantId) {
      console.error('❌ No se pudo obtener el tenantId');
      return throwError(() => new Error('Tenant no encontrado'));
    }

    const body = {
      newPassword,
      tenantId: tenant.tenantId  // ✅ Usar tenant.tenantId en lugar de getTenantId()
    };

    return this.http.put<UpdatePasswordResponse>(`${this.API_URL}/tenants/update-password`, body).pipe(
      tap((response: UpdatePasswordResponse) => {  // ✅ TIPADO EXPLÍCITO AQUÍ
        console.log('✅ Password updated successfully:', response);
        
        // ✅ 1. Actualizar TOKEN (el backend envía uno nuevo)
        if (response.result?.token) {  // ✅ TypeScript reconoce 'result'
          console.log('🔄 Actualizando token de acceso');
          localStorage.setItem('lotise_auth_token', response.result.token);
          console.log('✅ Token actualizado');
        } else {
          console.warn('⚠️ Backend NO retornó nuevo token');
        }
        
        // ✅ 2. Actualizar TENANT COMPLETO
        if (response.result?.tenant) {
          console.log('🔄 Actualizando tenant COMPLETO desde backend');
          localStorage.setItem('lotise_tenant', JSON.stringify(response.result.tenant));
          console.log('✅ Tenant actualizado:', {
            tenantId: response.result.tenant.tenantId,
            isProvisionalPassword: response.result.tenant.isProvisionalPassword
          });
        } else {
          console.error('❌ Backend NO retornó tenant en response.result.tenant');
        }
        
        // ✅ 3. Logs de verificación final
        console.log('📦 Estado FINAL del localStorage:', {
          tenant: this.getTenant(),
          tenantIsProvisional: this.getTenant()?.isProvisionalPassword,
          hasToken: !!this.getAccessToken()
        });
      }),
      catchError((error) => {
        console.error('❌ Error updating password:', error);
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  /**
   * Método helper para obtener el token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('lotise_auth_token');
  }

  /**
   * Método helper para obtener el tenant (ya existe, pero verificar que esté)
   */
  getTenant(): any {
    const tenant = localStorage.getItem('lotise_tenant');
    return tenant ? JSON.parse(tenant) : null;
  }

  getUser(): AuthUser | null {
    return this.storage.getUser();
  }

  hasValidSession(): boolean {
    return this.storage.hasValidSession();
  }

  isLoggedIn(): boolean {
    return this.hasValidSession();
  }

  validateTokensBeforeNavigation(): Observable<boolean> {
    if (this.hasValidSession()) {
      return of(true);
    }
    this.logout();
    return of(false);
  }

  logout(): void {
    this.storage.clearAll();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    return false;
  }

  refreshToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token para refrescar'));
    }

    return this.http.post(`${this.API_URL}/tenants/refresh-token`, { token }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storage.setToken(response.token);
        }
      }),
      catchError(error => {
        console.error('Error al refrescar token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }
}
