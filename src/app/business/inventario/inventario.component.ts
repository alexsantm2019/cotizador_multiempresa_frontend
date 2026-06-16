import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MatSlideToggle } from '@angular/material/slide-toggle';

// Servicio
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductosService } from '../../core/services/productos/productos.service';
import { ProductosInterface } from '../../core/models/productos.model';
import { InventarioSearchComponent } from './inventario-search/inventario-search.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TablerIconComponent,
    InventarioSearchComponent,
    MatIconModule,
    TablerIconComponent,
    MatSlideToggle,
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent implements OnInit {
  private productosService = inject(ProductosService);
  mostrarDescripcion: boolean = false;

  // displayedColumns: string[] = [
  //   'producto',
  //   'descripcion',
  //   'tipoCosto',
  //   'cantidad',
  //   'actualizado',
  //   'usuario',
  // ];

  get displayedColumns(): string[] {
    const columns = ['producto'];
    if (this.mostrarDescripcion) {
      columns.push('descripcion');
    }
    columns.push(
      // 'descripcion',
      'tipoCosto',
      'cantidad',
      'actualizado',
      'usuario',
    );
    return columns;
  }

  private toastr = inject(ToastrService);
  productosInventario = signal<ProductosInterface[]>([]);
  currentPage = 1;
  pageSize = 20;
  minimoProductosInventario = 5;

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  // Filtro:
  searchTerm = signal('');
  filteredInventario = computed(() =>
    this.productosInventario().filter((item) =>
      item.producto.toLowerCase().includes(this.searchTerm().toLowerCase()),
    ),
  );

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    // this.getProductosInventario();
    this.getProductosInventarioByEmpresaId();
  }

  // getProductosInventario(): void {
  //   this.productosService.getProductosInventario().subscribe({
  //     next: (data) => {
  //       // this.productosInventario = data;
  //       this.productosInventario.set(data);
  //     },
  //     error: (error) => {
  //       console.error('Error en la búsqueda de productos:', error);
  //     },
  //   });
  // }

  getProductosInventarioByEmpresaId(): void {
    let id = this.empresaId!;
    this.productosService.getProductosInventarioByEmpresaId(id).subscribe({
      next: (data) => {
        // this.productosInventario = data;
        this.productosInventario.set(data);
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  actualizarCantidad(producto: ProductosInterface) {
    const updatedData = { cantidad: producto.cantidad }; // Django actualiza 'inventario_updated_at' automáticamente

    this.productosService.updateInventario(producto.id, updatedData).subscribe({
      next: (response) => {
        this.showSuccess('Cantidad actualizada correctamente');
        this.getProductosInventarioByEmpresaId();
      },
      error: (error) => {
        this.showError('Error al actualizar el inventario');
      },
    });
  }

  getPagedInventario(): ProductosInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredInventario().slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

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
