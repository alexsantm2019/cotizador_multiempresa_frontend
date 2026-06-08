import { Component, OnInit } from '@angular/core';
import {
  AfterViewInit,
  ViewChild,
  inject,
  TemplateRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { CatalogosService } from '../../core/services/catalogos/catalogos.service';
import { CatalogosInterface } from '../../core/models/catalogos.models';
// import { Notyf } from 'notyf';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,

    TablerIconComponent,
  ],
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.scss'],
})
export class CatalogosComponent implements OnInit {
  catalogos: CatalogosInterface[] = [];
  grupoSeleccionado: number | null = null;
  nombreSeleccionado: string | null = null;
  nuevoCatalogo: Partial<CatalogosInterface> = {};
  nuevoForm!: FormGroup;
  // private toastr: ToastrService;
  private toastr = inject(ToastrService);
  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  displayedColumns: string[] = [
    'grupo',
    'codigo',
    'item',
    'detalle',
    'color',
    'acciones',
  ];

  editando: CatalogosInterface | null = null;
  // private notyf = new Notyf();
  // constructor(private catalogosService: CatalogosService) { }

  private catalogosService = inject(CatalogosService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    this.nuevoForm = this.fb.group({
      grupo: ['', Validators.required],
      codigo: ['', Validators.required],
      item: ['', Validators.required],
      detalle: ['', Validators.required],
      color: [''],
    });
    this.searchCatalogosActivo();
  }

  cargarCatalogo(): void {
    let empresaId = this.empresaId!;
    if (!this.grupoSeleccionado) return;
    // this.catalogosService.getCatalogoByGrupo(this.grupoSeleccionado).subscribe({
    //   next: (data) => (this.catalogos = data),
    //   error: (err) => console.error(err),
    // });
    this.catalogosService
      .getCatalogoByGrupoByEmpresaId(this.grupoSeleccionado, empresaId)
      .subscribe({
        next: (data) => (this.catalogos = data),
        error: (err) => console.error(err),
      });
  }
  searchCatalogoByNombre(): void {
    let empresaId = this.empresaId!;
    if (!this.nombreSeleccionado) return;
    // this.catalogosService
    //   .getCatalogoByNombre(this.nombreSeleccionado)
    //   .subscribe({
    //     next: (data) => (this.catalogos = data),
    //     error: (err) => console.error(err),
    //   });
     this.catalogosService
       .getCatalogoByNombreByEmpresaId(this.nombreSeleccionado, empresaId)
       .subscribe({
         next: (data) => (this.catalogos = data),
         error: (err) => console.error(err),
       });
    
  }

  searchCatalogos(): void {
    let empresaId = this.empresaId!;
    // this.catalogosService.getCatalogos().subscribe({
    //   next: (data) => (this.catalogos = data),
    //   error: (err) => console.error(err),
    // });
    this.catalogosService.getCatalogosByEmpresaId(empresaId).subscribe({
      next: (data) => (this.catalogos = data),
      error: (err) => console.error(err),
    });
  }
  searchCatalogosActivo(): void {
    let empresaId = this.empresaId!;
    // this.catalogosService.getCatalogosActivos().subscribe({
    //   next: (data) => (this.catalogos = data),
    //   error: (err) => console.error(err),
    // });
     this.catalogosService.getCatalogosActivosByEmpresaId(empresaId).subscribe({
       next: (data) => (this.catalogos = data),
       error: (err) => console.error(err),
     });
  }

  guardarCatalogo(): void {
    if (this.nuevoForm.invalid) {
      this.nuevoForm.markAllAsTouched(); // 💥 Marca errores al tocar “Guardar”
      return;
    }

    // const data = this.nuevoForm.value;
        // EMPRESA:
    const data = {
      ...this.nuevoForm.value,
      empresa_id: this.authService.getEmpresaId(),
    };

    this.catalogosService.createCatalogo(data).subscribe({
      next: () => {
        this.searchCatalogosActivo();
        // this.toastr.success("Catálogo guardado correctamente");
        this.nuevoForm.reset();
      },
      error: (err) => {
        // this.toastr.error("Ocurrió un error");
        console.error(err);
      },
    });
  }

  onInputChange(catalogo: any, field: string, value: any): void {
    catalogo[field] = value;
  }

  updateCatalogo(catalogo: CatalogosInterface): void {
    this.catalogosService.updateCatalogo(catalogo.id, catalogo).subscribe({
      next: () => {
        this.showSuccess('Registro actualizado correctamente');
        this.searchCatalogosActivo();
        this.cancelarEdicion();
      },
      error: (err) => console.error(err),
    });
  }

  editarCatalogo(catalogo: CatalogosInterface): void {
    this.editando = { ...catalogo };
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarCatalogo(id: number): void {
    if (confirm('¿Deseas eliminar este registro?')) {
      this.catalogosService
        .deleteCatalogo(id)
        .subscribe(() => this.searchCatalogosActivo());
      this.showSuccess('Registro eliminado correctamente');
    }
  }

  onChangeNuevo(key: keyof CatalogosInterface, value: any): void {
    this.nuevoCatalogo[key] = value;
  }

  onChangeEditando(key: keyof CatalogosInterface, value: any): void {
    if (this.editando) (this.editando as any)[key] = value;
  }

  showSuccess(msg: any) {
    this.toastr.success(msg);
  }
}
