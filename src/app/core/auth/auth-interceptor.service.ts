import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldExcludeToken(req.url)) {
      return next.handle(req);
    }
    return this.validateTokensExpiration(req, next);
  }

  private validateTokensExpiration(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.validateTokensBeforeNavigation().pipe(
      switchMap((isValid) => {
        if (isValid) {
          return this.sendRequestWithToken(request, next);
        } else {
          return throwError(() => new Error("Sesión expirada, cerrando sesión."));
        }
      })
    );
  }

  private refreshAccessToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.validateTokensBeforeNavigation().pipe(
      switchMap((isValid) => {
        if (isValid) {
          return this.sendRequestWithToken(request, next);
        } else {
          return throwError(() => new Error("Sesión expirada, cerrando sesión."));
        }
      })
    );
  }

  private sendRequestWithToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    if (token) {
      request = this.addTokenHeader(request, token);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, request, next))
    );
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (error.status === 401) {
      return this.refreshAccessToken(request, next);
    } else {
      if (!error.url || !error.url.includes("refreshtoken")) {
        // Aquí podrías agregar lógica para mostrar el error en consola o con otro sistema de notificación
        console.error(`Error status: ${error.status}, Error message: ${error.error?.errorMessage}`);
      }
    }
    return throwError(() => error);
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { authorization: `Bearer ${token}` }
    });
  }

  private shouldExcludeToken(url: string): boolean {
    const excludedUrls = [
      '/Authenticate/refreshtoken',
      '/Authenticate/authenticate',
    ];
    return excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }
}
