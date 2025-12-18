import { Injectable } from '@angular/core';

/**
 * Interfaz para el usuario autenticado
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER';
  tenantId: string | null;
  createdAt: string;
}

/**
 * Interfaz para el tenant
 * ✅ ACTUALIZADO: Mapear correctamente con respuesta del backend
 */
export interface Tenant {
  tenantId: string; // ✅ CAMBIADO: de 'id' a 'tenantId' (como viene del backend)
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  planId: string | null;
  planName: string | null;
  planType: string | null;
  priceAmount: number | null;
  stripeSubscriptionId: string | null;
  subscriptionItemId: string | null;
  domain: string | null;
  isProvisionalPassword?: boolean; // ✅ YA EXISTE
  createdAt: string;
  updatedAt: string;
}

/**
 * Servicio para manejo de almacenamiento local (localStorage)
 * Gestiona tokens, usuario y tenant en sesión
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'lotise_auth_token';
  private readonly USER_KEY = 'lotise_user';
  private readonly TENANT_KEY = 'lotise_tenant';

  // ==================== TOKEN METHODS ====================

  /**
   * Guardar token de autenticación
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtener token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verificar si existe un token
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Eliminar token
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ==================== USER METHODS ====================

  /**
   * Guardar datos del usuario autenticado
   */
  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Obtener datos del usuario autenticado
   */
  getUser(): AuthUser | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as AuthUser;
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      return null;
    }
  }

  /**
   * Verificar si existe un usuario en sesión
   */
  hasUser(): boolean {
    return this.getUser() !== null;
  }

  /**
   * Eliminar usuario
   */
  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // ==================== TENANT METHODS ====================

  /**
   * Guardar datos del tenant
   */
  setTenant(tenant: Tenant): void {
    localStorage.setItem(this.TENANT_KEY, JSON.stringify(tenant));
  }

  /**
   * Obtener datos del tenant
   */
  getTenant(): Tenant | null {
    const tenantData = localStorage.getItem(this.TENANT_KEY);
    if (!tenantData) return null;
    try {
      return JSON.parse(tenantData) as Tenant;
    } catch (error) {
      console.error('Error al parsear tenant:', error);
      return null;
    }
  }

  /**
   * Verificar si existe un tenant en sesión
   */
  hasTenant(): boolean {
    return this.getTenant() !== null;
  }

  /**
   * Eliminar tenant
   */
  removeTenant(): void {
    localStorage.removeItem(this.TENANT_KEY);
  }

  // ==================== CLEAR ALL ====================

  /**
   * Limpiar toda la sesión (logout)
   */
  clearAll(): void {
    this.removeToken();
    this.removeUser();
    this.removeTenant();
  }

  /**
   * Verificar si hay una sesión completa válida
   */
  hasValidSession(): boolean {
    return this.hasToken() && this.hasTenant();
  }
}
