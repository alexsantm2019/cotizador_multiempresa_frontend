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
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
// import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

// project import
// import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { ToastrService, ToastrModule } from 'ngx-toastr';

// Servicio:
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClientesService } from '../../../core/services/clientes/clientes.service';
import { ClientesInterface } from '../../../core/models/clientes.model';
import { ClienteSearchComponent } from '../cliente-search/cliente-search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [
    MatCardModule,
    NuevoClienteComponent,
    ClienteSearchComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    TablerIconComponent,
    MatTableModule,
  ],
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.scss'],
})
export class ListaClientesComponent implements OnInit {
  itemsPerPage: number = 20;

  displayedColumns: string[] = [
    'nombre',
    'identificacion',
    'telefono',
    'direccion',
    'acciones',
  ];

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
  }

  private clientesService = inject(ClientesService);
  // private toastr: ToastrService;
  private toastr = inject(ToastrService);

  clientes = signal<ClientesInterface[]>([]);
  currentPage = 1;
  pageSize = 20;
  isEditMode: boolean = false;
  clienteSeleccionado: ClientesInterface | null = null;

  // Filtro:
  searchTerm = signal('');
  filteredClientes = computed(() =>
    this.clientes().filter((item) =>
      item.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()),
    ),
  );

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    // this.getClientes();
    this.getClientesByEmpresaId();
  }

  getClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes.set(data);
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  getClientesByEmpresaId(): void {
    let id = this.empresaId!;
    this.clientesService.getClientesByEmpresaId(id).subscribe({
      next: (data) => {
        this.clientes.set(data);
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }
  getPagedClientes(): ClientesInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredClientes().slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onClienteGuardado(cliente: ClientesInterface): void {
    this.getClientesByEmpresaId();
  }

  deleteCliente(id: number) {
    this.clientesService.deleteCliente(id).subscribe(
      (response: any) => {
        this.getClientesByEmpresaId();
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
