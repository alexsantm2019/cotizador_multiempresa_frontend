// src/app/core/services/usuarios/usuario.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  User,
  UserCreate,
  UserUpdate,
} from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/usuarios/`;

  /**
   * Obtener lista de usuarios (filtrados por empresa automáticamente)
   */
  getUsuarios(filters?: any): Observable<User[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.is_active !== undefined)
        params = params.set('is_active', filters.is_active);
      if (filters.is_staff !== undefined)
        params = params.set('is_staff', filters.is_staff);
      if (filters.page) params = params.set('page', filters.page);
      if (filters.page_size)
        params = params.set('page_size', filters.page_size);
    }

    return this.http.get<User[]>(this.apiUrl, { params });
  }

  /**
   * Obtener TODOS los usuarios (solo para superadministradores)
   * Este método no filtra por empresa, devuelve todos los usuarios del sistema
   */
  getAllUsers(filters?: any): Observable<User[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.is_active !== undefined)
        params = params.set('is_active', filters.is_active);
      if (filters.is_staff !== undefined)
        params = params.set('is_staff', filters.is_staff);
      if (filters.is_superuser !== undefined)
        params = params.set('is_superuser', filters.is_superuser);
      if (filters.page) params = params.set('page', filters.page);
      if (filters.page_size)
        params = params.set('page_size', filters.page_size);
    }

    // Endpoint específico para superadministradores
    return this.http.get<User[]>(`${this.apiUrl}all-users/`, { params });
  }

  /**
   * Obtener un usuario por ID
   */
  getUsuarioById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}/`);
  }

  /**
   * Crear un nuevo usuario (se asigna automáticamente a la empresa del usuario logueado)
   */
  createUsuario(user: UserCreate): Observable<User> {
    // ⭐ No es necesario enviar empresa_id, el backend lo asigna automáticamente
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Crear un usuario con empresa y rol de administrador
   * ⭐ NUEVO MÉTODO
   */
  crearUsuarioConEmpresa(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}crear-con-empresa/`, userData);
  }

  /**
   * Actualizar un usuario
   */
  updateUsuario(id: number, user: UserUpdate): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${id}/`, user);
  }

  /**
   * Eliminar un usuario
   */
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  /**
   * Activar/Desactivar usuario
   */
  toggleUsuarioStatus(id: number, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${id}/toggle-status/`, {
      is_active: isActive,
    });
  }

  /**
   * Obtener empresas del usuario logueado
   */
  getMisEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}mis_empresas/`);
  }
}
