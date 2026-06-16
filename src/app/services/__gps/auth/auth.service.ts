import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../__environments/environment';
import { BehaviorSubject, Observable, Subscription, throwError, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDataInterface } from '../../../core/models/UserData.models';
import { JwtUtilsService } from './jwt-utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private server = environment.apiUrl;
  private serverProfile = environment.apiUrlProfiles;
  private apiUrl = `${this.server}/api`;
  private inactivityTimer!: Subscription;
  private tokenRefreshTimer!: Subscription;
  public apiUrlImagen = `${this.serverProfile}/img/internal`;

  // Observable para el token
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;

  // Observable para el usuario
  private currentUserSubject = new BehaviorSubject<UserDataInterface | null>(
    null
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly inactivityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
  ];

  private retryAttempts = 0;
  private maxRetries = 3;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtUtils: JwtUtilsService
  ) {
    this.resetInactivityTimer();
    this.tokenSubject = new BehaviorSubject<string | null>(
      localStorage.getItem('token')
    );
    this.token = this.tokenSubject.asObservable();
  }

  login(username: string, password: string) {
    return this.http
      .post<{
        accessToken: string;
        data: UserDataInterface;
        refreshToken: string;
        user_id: number;
        expires_at: string;
      }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refresh_token', response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('user_id', response.data.user_id.toString());
          localStorage.setItem('expires_at', response.expires_at);

          // Seteo de observables:
          this.tokenSubject.next(response.accessToken);
          this.currentUserSubject.next(response.data);
        })
      );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap((response) => {
        this.cleanUpAndRedirect(); 
      }),
      catchError((error) => {
        console.error('Error en logout:', error);
        this.cleanUpAndRedirect();
        return throwError(() => error); 
      })
    );
  }

  private cleanUpAndRedirect(): void {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expires_at');
    localStorage.clear();

    // Resetear observables
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);

    // Cancelar temporizadores
    this.tokenRefreshTimer?.unsubscribe();
    this.inactivityTimer?.unsubscribe();
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): UserDataInterface | null {
    return this.currentUserSubject.value;
  }

  loadCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    console.log('--- Refrescando token ------');
    const refreshToken = localStorage.getItem('refresh_token');
    const currentToken = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expires_at');

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No hay refresh token disponible'));
    }
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${this.apiUrl}/refresh-token`,
        {
          refresh_token: refreshToken,
        }
      )
      .pipe(
        tap((response) => {
          // Guardar nuevo accessToken
          localStorage.setItem('token', response.accessToken);
          console.log('Nuevo token: ' + response.accessToken);

          // Guardar nuevo refreshToken
          if (response.refreshToken) {
            localStorage.setItem('refresh_token', response.refreshToken);
          }
          console.log('Refresh token: ' + response.refreshToken);
          this.tokenSubject.next(response.accessToken);
          // Reinicia el temporizador de refresco
          this.startTokenRefreshTimer();
        }),
        catchError((error) => {
          console.log('----- Error en refreshToken -------');
          console.log('Error: ' + error);
          this.logout();
          return throwError(() => error);
        })
    );
  }

  private startTokenRefreshTimer(): void {
    const expiresAtString = localStorage.getItem('expires_at');
    let expiresAt: number | null = null;
    const accessToken = localStorage.getItem('token');

    if (expiresAtString) {
      expiresAt = new Date(expiresAtString).getTime();
    } else {
      expiresAt = accessToken
        ? this.jwtUtils.getTokenExpiration(accessToken)
        : null;
    }

    if (!expiresAt) return;

    const now = Date.now();
    // const refreshIn = expiresAt - now - environment.tokenRefreshOffset;
    const refreshOffset = environment.tokenRefreshOffset;
    const timeUntilExpiration = expiresAt - now;
    const refreshIn = timeUntilExpiration - refreshOffset;

    this.tokenRefreshTimer?.unsubscribe();
    if (refreshIn > 0) {
      this.tokenRefreshTimer = timer(refreshIn).subscribe(() => {
        this.refreshToken().subscribe();
      });
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? +userId : null;
  }
  getExpiredAtToken(): number | null {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) return null;
    return new Date(expiresAt).getTime();
  }

  ngOnDestroy(): void {
    this.inactivityTimer?.unsubscribe();
  }

  private showInactivityWarning(): void {
    const warningTime = 30000; // 30 segundos antes
    timer(environment.inactivityTimeout - warningTime).subscribe(() => {
      alert('¡Inactividad detectada! La sesión se cerrará en 30 segundos.');
    });
  }

  getUserImageUrl(relativePath: string): string {
    if (!relativePath) {
      return '/assets/images/profile/user5.jpg'; // Imagen por defecto
    }

    // Si ya es una URL completa (http, https o data URI)
    if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
      return relativePath;
    }

    // Si es una ruta relativa, concatenar con la URL base
    return `${this.apiUrlImagen}/${relativePath}`;
  }

  // =================================== FUNCIONES TIMER ================================
  // Reinicia el temporizador de inactividad
  resetInactivityTimer(): void {
    this.inactivityTimer?.unsubscribe();
    this.inactivityTimer = timer(environment.inactivityTimeout).subscribe({
      next: () => {
        console.log('Tiempo de inactividad alcanzado');
        this.logout().subscribe({
          next: () => console.log('Logout completo'),
          error: (err) => console.error('Error en logout:', err),
        });
      },
      error: (err) => console.error('Error en el temporizador:', err),
    });
  }
  startInactivityTimer(): void {
    this.resetInactivityTimer();
    // Agregar listeners de eventos
    this.inactivityEvents.forEach((event) => {
      window.addEventListener(event, this.resetInactivityTimer.bind(this));
    });
  }
  stopInactivityTimer(): void {
    this.inactivityTimer?.unsubscribe();

    // Remover todos los event listeners
    this.inactivityEvents.forEach((event) => {
      window.removeEventListener(event, this.resetInactivityTimer.bind(this));
    });
  }
}
