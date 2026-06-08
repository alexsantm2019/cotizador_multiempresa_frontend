import { Injectable, inject } from '@angular/core';
import { environment } from '../../__environments/environment';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../services/gps/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // if (this.shouldRefreshToken()) {
    //   console.log("===> si debo refrescar")
    // } else {
    //   console.log("====>Continuo con token normal");
    // }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('==> Error A');
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.authService.getToken();
              if (newToken) {
                request = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                return next.handle(request);
              } else {
                this.authService.logout();
                return throwError(error);
              }
            }),
            catchError((refreshError) => {
              this.authService.logout();
              console.log('Aqui hay un error 1');
              return throwError(refreshError);
            })
          );
        } else {
          console.log('==> Error C');
          return throwError(error);
        }
      })
    );
  }

  private shouldRefreshToken(): boolean {
    const expiresAtRaw = localStorage.getItem('expires_at');
    if (!expiresAtRaw) {
      console.warn('[AuthInterceptor] No expires_at en localStorage');
      return false;
    }

    // Parsear expiresAt como fecha local
    const expiresAtDate = new Date(expiresAtRaw.replace(' ', 'T'));
    const expiresAt = expiresAtDate.getTime();

    if (isNaN(expiresAt)) {
      console.error('[AuthInterceptor] expires_at no es válido:', expiresAtRaw);
      return false;
    }

    const now = Date.now();
    const refreshOffset = environment.tokenRefreshOffset ?? 60000; // ms

    const timeLeft = expiresAt - now;

    console.log(
      '[AuthInterceptor] expiresAt:',
      expiresAtDate.toLocaleString(),
      ' now:',
      new Date(now).toLocaleString(),
      ' timeLeft(ms):',
      timeLeft,
      ' refreshOffset(ms):',
      refreshOffset
    );

    // Debe refrescar si el tiempo restante es menor o igual al offset y mayor que 0
    return timeLeft <= refreshOffset && timeLeft > 0;
  }
}

