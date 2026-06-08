import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatalogosInterface } from '../../models/catalogos.models';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/catalogos`;

  constructor(private http: HttpClient) {}

  getCatalogoByGrupo(id: number): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(
      `${this.apiUrl}/get_catalogo_by_grupo/${id}`,
    );
  }
  getCatalogoByNombre(nombre: string): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(
      `${this.apiUrl}/get_catalogo_by_nombre/${nombre}`,
    );
  }

  getCatalogos(): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(`${this.apiUrl}/get_catalogos/`);
  }

  getCatalogosActivos(): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(
      `${this.apiUrl}/get_catalogos_activos/`,
    );
  }
  // ============================ NUEVOS ===========================
  getCatalogoByGrupoByEmpresaId(
    id: number,
    empresaId: number,
  ): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(
      `${this.apiUrl}/get_catalogo_by_grupo_by_empresa_id/${id}/${empresaId}`,
    );
  }
  getCatalogoByNombreByEmpresaId(
    nombre: string,
    empresaId: number,
  ): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(
      `${this.apiUrl}/get_catalogo_by_nombre_by_empresa_id/${nombre}/${empresaId}`,
    );
  }

  getCatalogosByEmpresaId(empresaId: number): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(
      `${this.apiUrl}/get_catalogos_by_empresa_id/${empresaId}`,
    );
  }

  getCatalogosActivosByEmpresaId(
    empresaId: number,
  ): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(
      `${this.apiUrl}/get_catalogos_activos_by_empresa_id/${empresaId}`,
    );
  }
  // ============================ FIN NUEVOS ===========================
  createCatalogo(data: CatalogosInterface): Observable<CatalogosInterface> {
    return this.http.post<CatalogosInterface>(
      `${this.apiUrl}/create_catalogo/`,
      data,
    );
  }

  deleteCatalogo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_catalogo/${id}/`);
  }

  updateCatalogo(id: number, updatedData: any): Observable<CatalogosInterface> {
    const url = `${this.apiUrl}/update_catalogo/${id}`;
    return this.http.put<CatalogosInterface>(url, updatedData);
  }
}