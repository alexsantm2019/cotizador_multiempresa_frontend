// angular import
import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconComponent } from 'angular-tabler-icons';

// Servicio
import { AuthService } from '../../../core/services/auth/auth.service';
import { CategoriaProductoService } from '../../../core/services/categoria-producto/categoria-producto.service';
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    TablerIconComponent,
  ],
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.scss'],
})
export class ListaCategoriasComponent implements OnInit {
  @Output() editarCategoriaEvent =
    new EventEmitter<CategoriaProductoInterface>();

  private categoriaProductosService = inject(CategoriaProductoService);
  categoriaProductos: CategoriaProductoInterface[] = [];
  currentPage = 1;
  pageSize = 5;
  displayedColumns: string[] = ['categoria', 'acciones'];

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    this.getCategoriaProductoByEmpresaId();
  }

  // getCategoriaProductos(): void {
  //   this.categoriaProductosService.getCategoriaProducto().subscribe({
  //     next: (data) => {
  //       this.categoriaProductos = data;
  //     },
  //     error: (error) => {
  //       console.error('Error en la búsqueda de categorías:', error);
  //     },
  //   });
  // }

  getCategoriaProductoByEmpresaId(): void {
    let id = this.empresaId!;
    this.categoriaProductosService.getCategoriaProductoByEmpresaId(id ).subscribe({
      next: (data) => {
        this.categoriaProductos = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de categorías:', error);
      },
    });
  }

  getPagedCategorias(): CategoriaProductoInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.categoriaProductos.slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

  editarCategoria(categoria: CategoriaProductoInterface): void {
    this.editarCategoriaEvent.emit(categoria);
  }

  deleteCategoria(id: number): void {
    if (!confirm('¿Deseas eliminar esta categoría?')) {
      return;
    }

    this.categoriaProductosService.deleteCategoriaProducto(id).subscribe({
      next: () => {
        this.getCategoriaProductoByEmpresaId();
      },
      error: (error) => console.error('Error al eliminar:', error),
    });
  }
}
