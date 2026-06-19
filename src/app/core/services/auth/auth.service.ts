import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthInterface } from '../../models/auth.models';
import { UserDataInterface } from '../../models/UserData.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/token/`;
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;
  private currentUserSubject = new BehaviorSubject<UserDataInterface | null>(
    null,
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.tokenSubject = new BehaviorSubject<string | null>(
      localStorage.getItem('token'),
    );
    this.token = this.tokenSubject.asObservable();

    // Cargar usuario del localStorage al iniciar el servicio
    this.loadCurrentUser();
  }

  login(username: string, password: string) {
    return this.http
      .post<AuthInterface>(`${this.apiUrl}`, { username, password })
      .pipe(
        tap((response) => {
          this.setUserData(response);
        }),
      );
  }

  private setUserData(response: AuthInterface) {
    localStorage.setItem('token', response.access);
    localStorage.setItem('user_id', response.user_id.toString());
    localStorage.setItem('empresa_id', response.empresa_id.toString());
    localStorage.setItem('full_name', response.full_name);
    localStorage.setItem('user', JSON.stringify(response));

    this.tokenSubject.next(response.access);
    this.currentUserSubject.next(response);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('full_name');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<AuthInterface>(`${this.apiUrl}/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.access);
          this.tokenSubject.next(response.access);
        }),
      );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? +userId : null;
  }

  getEmpresaId(): number | null {
    const empresaId = localStorage.getItem('empresa_id');
    return empresaId ? +empresaId : null;
  }

  getFullName(): string | null {
    return localStorage.getItem('full_name');
  }

  loadCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.currentUserSubject.next(userData);
      } catch (error) {
        console.error('Error parsing user data', error);
        this.currentUserSubject.next(null);
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }

  // Método para obtener el usuario actual de forma síncrona
  getCurrentUser(): UserDataInterface | null {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error('Error parsing user data', error);
        return null;
      }
    }
    return null;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
