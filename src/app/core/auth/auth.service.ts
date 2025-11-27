
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

export interface Tenant {
  tenantId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  subscriptionStatus: string;
  stripeCustomerId: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
  domain: string | null;
}

export interface LoginResponse {
  token: string;
  tenant: Tenant;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TENANT_KEY = 'tenant_info';

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {}

  login(login: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('https://api.lotise.com/tenants/login', { login, password }).pipe(
      tap((response: LoginResponse) => {
        this.storage.set(this.TOKEN_KEY, response.token);
        this.storage.set(this.TENANT_KEY, response.tenant);
      })
    );
  }

  getAccessToken(): string | null {
    return this.storage.get<string>(this.TOKEN_KEY);
  }

  getTenant(): Tenant | null {
    return this.storage.get<Tenant>(this.TENANT_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  validateTokensBeforeNavigation(): Observable<boolean> {
    return of(this.isLoggedIn());
  }

  logout(): void {
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.TENANT_KEY);
    this.storage.clear();
    this.router.navigate(['/login']);
  }
}
