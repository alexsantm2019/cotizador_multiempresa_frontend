// angular import
import {
  AfterViewInit,
  OnInit,
  ViewChild,
  inject,
  TemplateRef,
  signal,
  computed,
} from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
// import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ToastrService, ToastrModule } from 'ngx-toastr';
// project import
// import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { Notyf } from 'notyf';
// import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';

// Servicio:
import { AuthService } from '../../../core/services/auth/auth.service';
import { PaquetesService } from '../../../core/services/paquetes/paquetes.service';
import { PaqueteInterface } from '../../../core/models/paquetes.models';
import { PaqueteSearchComponent } from '../paquete-search/paquete-search.component';

@Component({
  selector: 'app-lista-paquetes',
  standalone: true,
  imports: [
    PaqueteSearchComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    TablerIconComponent,
  ],
  templateUrl: './lista-paquetes.component.html',
  styleUrls: ['./lista-paquetes.component.scss'],
})
export class ListaPaquetesComponent implements OnInit {
  constructor(private router: Router) {}

  private toastr: ToastrService;
  private paquetesService = inject(PaquetesService);

  paquetes = signal<PaqueteInterface[]>([]);
  currentPage = 1;
  pageSize = 20;
  itemsPerPage: number = 15;
  isEditMode: boolean = false;
  paqueteSeleccionado: PaqueteInterface | null = null;
  expandedPaquetes: { [key: number]: boolean } = {};
  visibleDetallesId: number | null = null;
  displayedColumns: string[] = [
    'paquete',
    'descripcion',
    'costo',
    'estado',
    'acciones',
  ];
  // Filtro:
  searchTerm = signal('');
  filteredPaquetes = computed(() =>
    this.paquetes().filter((item) =>
      item.nombre_paquete
        .toLowerCase()
        .includes(this.searchTerm().toLowerCase()),
    ),
  );

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    this.getPaquetes();
  }

  // Verifica si los detalles de un paquete están visibles
  isDetalleVisible(id: number): boolean {
    return this.visibleDetallesId === id;
  }

  // Alterna la visibilidad de los detalles del paquete
  toggleDetalles(id: number): void {
    this.visibleDetallesId = this.visibleDetallesId === id ? null : id;
  }

  // Obtiene los paquetes desde el servicio
  getPaquetes(): void {
    let id = this.empresaId!;
    this.paquetesService.getPaquetesByEmpresaId(id).subscribe({
      next: (data) => {
        this.paquetes.set(data);
      },
      error: (error) => {
        console.error('Error en la búsqueda de paquetes:', error);
      },
    });
  }

  // Calcula los paquetes de la página actual
  // getPagedPaquetes(): PaqueteInterface[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   return this.paquetes.slice(startIndex, endIndex);
  // }
  getPagedPaquetes(): PaqueteInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPaquetes().slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  // Cambia la página de la tabla
  // changePage(page: number): void {
  //   this.currentPage = page;
  // }

  // Obtiene un arreglo de páginas posibles para la paginación
  // getPageArray(totalItems: number): number[] {
  //   const totalPages = Math.ceil(totalItems / this.itemsPerPage);
  //   return Array.from({ length: totalPages }, (_, index) => index + 1);
  // }

  // Elimina un producto (paquete)
  deletePaquete(id: number): void {
    console.log('Eliminar paquete con id:', id);
    this.paquetesService.deletePaquete(id).subscribe(
      (response: any) => {
        this.getPaquetes();
        this.showSuccess('Registro eliminado correctamente');
      },
      (error: any) => {
        console.log('Error' + JSON.stringify(error));
        this.showError(error);
      },
    );
    // Lógica de eliminación aquí...
  }

  nuevoPaquete(): void {
    this.router.navigate(['/business/nuevo-paquete']);
  }

  editarPaquete(id: number): void {
    this.router.navigate(['/business/editar-paquete', id]);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

  //Filtro:
  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  showSuccess(msg: any) {
    this.toastr.success(msg);
  }
  showError(msg: any) {
    this.toastr.error(msg);
  }
}
