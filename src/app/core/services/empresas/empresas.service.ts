import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmpresaInterface } from '../../models/empresas.models';

@Injectable({
  providedIn: 'root',
})
export class EmpresasService {
  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/empresas/`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de empresas (activas, no eliminadas)
   */

  getTodasEmpresas(): Observable<any> {
    return this.http.get(`${this.apiUrl}lista-empresas/`);
  }

  // getEmpresas(): Observable<EmpresaInterface[]> {
  //   return this.http.get<EmpresaInterface[]>(this.apiUrl);
  // }

  getEmpresas(filters?: {
    search?: string;
    estado?: boolean;
    page?: number;
    page_size?: number;
  }): Observable<EmpresaInterface[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.estado !== undefined)
        params = params.set('estado', filters.estado);
      if (filters.page) params = params.set('page', filters.page);
      if (filters.page_size)
        params = params.set('page_size', filters.page_size);
    }

    return this.http.get<EmpresaInterface[]>(this.apiUrl, { params });
  }

  /**
   * Obtener una empresa por ID
   */
  getEmpresaById(id: number): Observable<EmpresaInterface> {
    return this.http.get<EmpresaInterface>(`${this.apiUrl}${id}/`);
  }

  /**
   * Crear una nueva empresa
   */
  // createEmpresa(empresa: EmpresaInterface): Observable<EmpresaInterface> {
  //   return this.http.post<EmpresaInterface>(this.apiUrl, empresa);
  // }
  createEmpresa(empresa: any): Observable<EmpresaInterface> {
    // Si es FormData, enviarlo directamente
    if (empresa instanceof FormData) {
      return this.http.post<EmpresaInterface>(this.apiUrl, empresa);
    }
    // Si es objeto normal, convertirlo a FormData
    const formData = this.objectToFormData(empresa);
    return this.http.post<EmpresaInterface>(this.apiUrl, formData);
  }

  /**
   * ⭐ Convertir objeto a FormData
   */
  private objectToFormData(obj: any): FormData {
    const formData = new FormData();
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        // Si es un archivo, agregarlo como blob
        if (obj[key] instanceof File) {
          formData.append(key, obj[key]);
        } else {
          formData.append(key, obj[key]);
        }
      }
    });
    return formData;
  }

  /**
   * Crear una empresa con logo (multipart/form-data)
   */
  createEmpresaWithLogo(formData: FormData): Observable<EmpresaInterface> {
    return this.http.post<EmpresaInterface>(this.apiUrl, formData);
  }

  /**
   * Actualizar una empresa
   */
  // updateEmpresa(
  //   id: number,
  //   empresa: EmpresaInterface,
  // ): Observable<EmpresaInterface> {
  //   return this.http.put<EmpresaInterface>(`${this.apiUrl}${id}/`, empresa);
  // }

  updateEmpresa(id: number, empresa: any): Observable<EmpresaInterface> {
    if (empresa instanceof FormData) {
      return this.http.put<EmpresaInterface>(`${this.apiUrl}${id}/`, empresa);
    }
    const formData = this.objectToFormData(empresa);
    return this.http.put<EmpresaInterface>(`${this.apiUrl}${id}/`, formData);
  }

  /**
   * Actualizar una empresa con logo (multipart/form-data)
   */
  updateEmpresaWithLogo(
    id: number,
    formData: FormData,
  ): Observable<EmpresaInterface> {
    return this.http.put<EmpresaInterface>(`${this.apiUrl}${id}/`, formData);
  }

  /**
   * Eliminar una empresa (soft delete)
   */
  deleteEmpresa(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}${id}/`);
  }

  /**
   * Obtener el logo de una empresa (URL completa)
   */
  getLogoUrl(logoPath: string | null): string | null {
    if (!logoPath) return null;
    // Si ya es una URL completa, devolverla
    if (logoPath.startsWith('http')) return logoPath;
    // Si es una ruta relativa, construir la URL completa
    return `${environment.apiUrl}${logoPath}`;
  }

  /**
   * Activar/Desactivar empresa (usando el campo estado)
   */
  toggleEmpresaStatus(
    id: number,
    estado: boolean,
  ): Observable<EmpresaInterface> {
    return this.http.patch<EmpresaInterface>(`${this.apiUrl}${id}/`, {
      estado,
    });
  }
}
