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
  input,
  output,
} from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { NgbModal, NgbModalRef, NgbModalModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

// Servicio:
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClientesService } from '../../../core/services/clientes/clientes.service';
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service';
import { CategoriaProductoService } from '../../../core/services/categoria-producto/categoria-producto.service';
import { ClientesInterface } from '../../../core/models/clientes.model';
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconComponent } from 'angular-tabler-icons';
@Component({
  selector: 'app-nuevo-cliente',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TablerIconComponent,
  ],
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.scss'],
})
export class NuevoClienteComponent {
  private clientesService = inject(ClientesService);
  private dialog = inject(MatDialog);
  @ViewChild('content')
  content!: TemplateRef<any>;
  @Input() cliente: ClientesInterface | null = null;
  @Input() isEditMode: boolean = false;
  clienteGuardado = output<ClientesInterface>();
  clienteForm!: FormGroup;
  // private toastr: ToastrService;
  private toastr = inject(ToastrService);

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.clienteForm = this.formBuilder.group({
      id: [null],
      nombre: ['', [Validators.required]],
      identificacion: [''],
      correo: [''],
      telefono: [''],
      direccion: [''],
    });
  }

  // modalRef: NgbModalRef | undefined;
  clienteSeleccionado: ClientesInterface | null = null;

  ngOnInit(): void {
    if (this.cliente) {
      this.clienteForm.patchValue({ ...this.cliente }); // Actualiza el formulario con los valores del producto
    }
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    // const formValue = this.clienteForm.value; // Obtén solo los valores del formulario
    // EMPRESA:
    const formValue = {
      ...this.clienteForm.value,
      empresa_id: this.authService.getEmpresaId(),
    };

    if (this.isEditMode) {
      const id = formValue.id; // Extrae el ID del formulario
      this.clientesService.updateCliente(id, formValue).subscribe({
        next: (producto) => {
          this.clienteGuardado.emit(producto);
          this.closeModal();
          this.showSuccess('Registro actualizado correctamente');
        },
        error: (error) =>
          console.error('Error al actualizar el producto:', error),
      });
    } else {
      this.clientesService.createCliente(formValue).subscribe({
        next: (data) => {
          this.clienteGuardado.emit(data);
          this.resetForm();
          this.closeModal();

          this.showSuccess('Registro almacenado correctamente');
        },
        error: (error) => console.error('Error al crear el producto', error),
      });
    }
  }

  resetForm(): void {
    // this.productoForm = { id: 0, producto: '', descripcion: '', tipo_costo: 0, costo: 0, estado: 1, ubicacion: '' }; // Reseteamos el producto
    //this.productoForm = {  producto: '', descripcion: '', tipo_costo: 0, costo: 0, estado: 1, ubicacion: '' }; // Reseteamos el producto
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(this.content, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });

    // dialogRef.afterClosed().subscribe(() => {
    //   console.log('Dialog cerrado');
    // });
  }
  closeModal() {
    this.dialog.closeAll();
  }

  showSuccess(msg: any) {
    this.toastr.success(msg);
  }
  showError(msg: any) {
    this.toastr.error(msg);
  }
}
