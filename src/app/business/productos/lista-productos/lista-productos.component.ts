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
import { RouterModule, Router } from '@angular/router';

// project import
// import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MatTableModule } from '@angular/material/table';

// Servicio:
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProductosService } from '../../../core/services/productos/productos.service';
import { ProductosInterface } from '../../../core/models/productos.model';
import { ProductoSearchComponent } from '../producto-search/producto-search.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [
    // SharedModule,
    NuevoProductoComponent,
    // NgbModalModule,
    ProductoSearchComponent,
    MatCardModule,
    // NuevoClienteComponent,
    // ClienteSearchComponent,
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
  ],
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss'],
})
export class ListaProductosComponent implements OnInit {
  private productosService = inject(ProductosService);
  productos = signal<ProductosInterface[]>([]);
  currentPage = 1;
  pageSize = 20;
  isEditMode: boolean = false;
  productoSeleccionado: ProductosInterface | null = null;
  mostrarDescripcion: boolean = false;
  private toastr = inject(ToastrService);

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  // Filtro:
  searchTerm = signal('');
  filteredProductos = computed(() =>
    this.productos().filter((item) =>
      item.producto.toLowerCase().includes(this.searchTerm().toLowerCase()),
    ),
  );
  itemsPerPage: number = 20;

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    // this.getProductos();
    this.getProductosByEmpresaId();
  }

  get displayedColumns(): string[] {
    const columns = ['producto'];
    if (this.mostrarDescripcion) {
      columns.push('descripcion');
    }
    columns.push(
      'cantidad',
      'tipo_costo',
      'costo',
      'ubicacion',
      'categoria',
      'estado',
      'usuario',
      'acciones',
    );
    return columns;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
  }

  // getProductos(): void {
  //   this.productosService.getProductos().subscribe({
  //     next: (data) => {
  //       // this.productos = data;
  //       this.productos.set(data);
  //     },
  //     error: (error) => {
  //       console.error('Error en la búsqueda de productos:', error);
  //     },
  //   });
  // }

  getProductosByEmpresaId(): void {
    let id = this.empresaId!;
    this.productosService.getProductosByEmpresaId(id).subscribe({
      next: (data) => {
        // this.productos = data;
        this.productos.set(data);
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  getPagedProducts(): ProductosInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProductos().slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onProductoGuardado(producto: ProductosInterface): void {
    this.getProductosByEmpresaId();
  }

  deleteProducto(id: number) {
    this.productosService.deleteProducto(id).subscribe(
      (response: any) => {
        this.getProductosByEmpresaId();
        this.showSuccess('Registro eliminado correctamente');
      },
      (error: any) => {
        console.log('Error' + JSON.stringify(error));
        this.showError(error);
      },
    );
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
