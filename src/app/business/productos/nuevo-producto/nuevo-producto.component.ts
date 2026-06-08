// angular import
import {
  TemplateRef,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import {
//   NgbModal,
//   NgbModalRef,
//   NgbModalModule,
//   ModalDismissReasons,
// } from '@ng-bootstrap/ng-bootstrap';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';

// project import
// import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { Notyf } from 'notyf';
// import { ToastComponent } from '../../ui/toast/toast.component';

// Servicio:
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProductosService } from '../../../core/services/productos/productos.service';
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service';
import { CategoriaProductoService } from '../../../core/services/categoria-producto/categoria-producto.service';
import { ProductosInterface } from '../../../core/models/productos.model';
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';
import { CATALOGOS } from '../../../core/utils/catalogo';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-nuevo-producto',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    TablerIconComponent,
    MatDialogModule,
  ],
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.scss'],
})
export class NuevoProductoComponent {
  // private modalService = inject(NgbModal);
  private productosService = inject(ProductosService);
  private catalogosService = inject(CatalogosService);
  private categoriaProductoService = inject(CategoriaProductoService);
  // private notyf = new Notyf();
  private dialog = inject(MatDialog);
  private toastr: ToastrService;

  @Input() producto: ProductosInterface | null = null; // Producto recibido del padre
  @Input() isEditMode: boolean = false; // Modo edición o creación
  @Output() productoGuardado = new EventEmitter<ProductosInterface>(); // Evento al guardar producto

  productoForm!: FormGroup;
  tipoCostos: any[] = [];
  estadosProductos: any[] = [];
  categoriasProductos: CategoriaProductoInterface[] = [];

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.productoForm = this.formBuilder.group({
      id: [null],
      producto: ['', [Validators.required]],
      descripcion: [''],
      tipo_costo: ['', [Validators.required]],
      costo: [0, [Validators.required, Validators.min(0)]],
      ubicacion: [''],
      estado: ['', [Validators.required]],
      categoria_producto_id: ['', [Validators.required]],
    });
  }

  // modalRef: NgbModalRef | undefined;
  productoSeleccionado: ProductosInterface | null = null;

  ngOnInit(): void {
    if (this.producto) {
      this.productoForm.patchValue({ ...this.producto }); // Actualiza el formulario con los valores del producto
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    // const formValue = this.productoForm.value; // Obtén solo los valores del formulario

    // EMPRESA:
    const formValue = {
      ...this.productoForm.value,
      empresa_id: this.authService.getEmpresaId(),
    };

    if (this.isEditMode) {
      const id = formValue.id; // Extrae el ID del formulario
      this.productosService.updateProducto(id, formValue).subscribe({
        next: (producto) => {
          this.productoGuardado.emit(producto);
          this.closeModal();
          this.showSuccess('Registro actualizado correctamente');
        },
        error: (error) =>
          console.error('Error al actualizar el producto:', error),
      });
    } else {
      this.productosService.createProducto(formValue).subscribe({
        next: (data) => {
          this.productoGuardado.emit(data);
          this.resetForm();
          this.closeModal();

          this.showSuccess('Registro almacenado correctamente');
        },
        error: (error) => console.error('Error al crear el producto', error),
      });
    }
  }

  resetForm(): void {
    this.productoForm.reset(); // Resetea los valores

    // Se asegura de que el formulario esté limpio
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }
  openModal(content: TemplateRef<any>) {
    this.getCategoriaProducto();
    this.getTipoCostos();
    this.getEstadosProducto();

    this.dialog.open(content, {
      width: '800px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  getCategoriaProducto(): void {
    this.categoriaProductoService.getCategoriaProducto().subscribe({
      next: (data) => {
        this.categoriasProductos = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }
  getTipoCostos(): void {
    this.catalogosService
      .getCatalogoByGrupo(CATALOGOS.GRUPO_TIPO_COSTOS_PRODUCTOS)
      .subscribe({
        next: (data) => {
          this.tipoCostos = data; // Asignamos los datos obtenidos
        },
        error: (error) => {
          console.error('Error al obtener tipo de costos:', error);
        },
      });
  }
  getEstadosProducto(): void {
    this.catalogosService
      .getCatalogoByGrupo(CATALOGOS.GRUPO_ESTADOS_PRODUCTOS)
      .subscribe({
        next: (data) => {
          this.estadosProductos = data; // Asignamos los datos obtenidos
        },
        error: (error) => {
          console.error('Error al obtener tipo de costos:', error);
        },
      });
  }

  showSuccess(msg: any) {
    this.toastr.success(msg);
  }
  showError(msg: any) {
    this.toastr.error(msg);
  }
}
