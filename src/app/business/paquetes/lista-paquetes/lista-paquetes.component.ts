// angular import
import {
  AfterViewInit,
  OnInit,
  ViewChild,
  inject,
  TemplateRef,
  signal,
  computed,
  effect,
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
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';

// Servicio:
import { AuthService } from '../../../core/services/auth/auth.service';
import { PaquetesService } from '../../../core/services/paquetes/paquetes.service';
import { PaqueteInterface } from '../../../core/models/paquetes.models';
import { PaqueteSearchComponent } from '../paquete-search/paquete-search.component';
import { FormsModule } from '@angular/forms';

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
    TablerIconComponent,
    MatTableModule,
    MatSlideToggle,
    FormsModule,
    MatSlideToggleModule,
    MatSlideToggle,
  ],
  templateUrl: './lista-paquetes.component.html',
  styleUrls: ['./lista-paquetes.component.scss'],
})
export class ListaPaquetesComponent implements OnInit {
  constructor(private router: Router) {
        effect(() => {
          console.log('DataSource actualizado:', this.dataSource());
          console.log('visibleDetallesId:', this.visibleDetallesId());
        });
  }

  // private toastr: ToastrService;
  private toastr = inject(ToastrService);
  private paquetesService = inject(PaquetesService);

  paquetes = signal<PaqueteInterface[]>([]);
  currentPage = 1;
  pageSize = 20;
  itemsPerPage: number = 15;
  isEditMode: boolean = false;
  paqueteSeleccionado: PaqueteInterface | null = null;
  expandedPaquetes: { [key: number]: boolean } = {};
  // visibleDetallesId: number | null = null;
  mostrarDescripcion: boolean = false;
  // displayedColumns: string[] = [
  //   'paquete',
  //   'descripcion',
  //   'costo',
  //   'estado',
  //   'acciones',
  // ];
  get displayedColumns(): string[] {
    const columns = ['paquete'];
    if (this.mostrarDescripcion) {
      columns.push('descripcion');
    }
    columns.push('costo', 'estado', 'acciones');
    return columns;
  }
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

  // ⭐ Convertir visibleDetallesId a signal
  visibleDetallesId = signal<number | null>(null);

  // ⭐ DataSource que combina filas principales + detalles
  dataSource = computed(() => {
    const paquetes = this.getPagedPaquetes();
    const rows: any[] = [];
    const visibleId = this.visibleDetallesId(); // ⭐ Leer la signal

    paquetes.forEach((paquete) => {
      // Fila principal
      rows.push({
        ...paquete,
        isMainRow: true,
        isDetailRow: false,
      });

      // Fila de detalle (solo si está expandido)
      if (
        visibleId === paquete.id &&
        paquete.detalles &&
        paquete.detalles.length > 0
      ) {
        rows.push({
          ...paquete,
          isMainRow: false,
          isDetailRow: true,
        });
      }
    });

    return rows;
  });

  // ⭐ Métodos para identificar tipos de fila
  isMainRow = (index: number, rowData: any): boolean => {
    return rowData && rowData.isMainRow === true;
  };

  isDetailRow = (index: number, rowData: any): boolean => {
    return rowData && rowData.isDetailRow === true;
  };

  // ⭐ Alternar visibilidad de detalles
  toggleDetalles(id: number): void {
    this.visibleDetallesId.update((current) => (current === id ? null : id));
  }

  isDetalleVisible(id: number): boolean {
    return this.visibleDetallesId() === id;
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
  }

  nuevoPaquete(): void {
    this.router.navigate(['/business/nuevo-paquete']);
  }

  editarPaquete(id: number): void {
    this.router.navigate(['/business/nuevo-paquete'], {
      queryParams: { paqueteId: id },
    });
    // this.router.navigate(['/business/editar-paquete', id]);
    //  this.router.navigate(['/business/paquete', id]);
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
