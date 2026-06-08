// angular import
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { TablerIconComponent } from 'angular-tabler-icons';

// Servicio
import { CategoriaProductoService } from '../../../core/services/categoria-producto/categoria-producto.service';

// Interfaces:
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TablerIconComponent,
  ],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss'],
})
export class CategoriaFormComponent {
  private categoriaProductoService = inject(CategoriaProductoService);

  @Input() isEditMode: boolean = false; // Modo edición o creación
  @Input() categoriaEditada: CategoriaProductoInterface | null = null; // Recibe datos al editar
  @Output() categoriaGuardada = new EventEmitter<void>(); // Evento para notificar cambios

  categoriaForm!: FormGroup;
  // private notyf = new Notyf();
  private toastr: ToastrService;

  constructor(private formBuilder: FormBuilder) {
    this.categoriaForm = this.formBuilder.group({
      id: [null],
      categoria: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.categoriaEditada) {
      console.log('cambiando.....');
      this.isEditMode = true;
      this.categoriaForm.patchValue(this.categoriaEditada); // Rellenar formulario si es edición
    }
  }

  changeEditMode(): void {
    this.isEditMode = false;
    this.resetForm();
  }
  onSubmit(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const formValue = this.categoriaForm.value;

    if (this.isEditMode) {
      const id = formValue.id;

      this.categoriaProductoService
        .updateCategoriaProducto(id, formValue)
        .subscribe({
          next: () => {
            this.categoriaGuardada.emit();

            this.showSuccess('Registro actualizado correctamente');

            this.resetForm();
          },
          error: (error) => console.error('Error al actualizar:', error),
        });
    } else {
      this.categoriaProductoService
        .createCategoriaProducto(formValue)
        .subscribe({
          next: () => {
            this.categoriaGuardada.emit();

            this.showSuccess('Registro almacenado correctamente');

            this.resetForm();
          },
          error: (error) => console.error('Error al crear:', error),
        });
    }
  }
  // onSubmit(): void {
  //   if (this.categoriaForm.invalid) {
  //     this.categoriaForm.markAllAsTouched();
  //     return;
  //   }

  //   const formValue = this.categoriaForm.value;

  //   if (this.isEditMode) {
  //     const id = formValue.id;
  //     this.categoriaProductoService
  //       .updateCategoriaProducto(id, formValue)
  //       .subscribe({
  //         next: () => {
  //           this.categoriaGuardada.emit(); // Emitimos evento
  //           this.showSuccess('Registro actualizado correctamente');
  //           this.changeEditMode();
  //         },
  //         error: (error) => console.error('Error al actualizar:', error),
  //       });
  //   } else {
  //     this.categoriaProductoService
  //       .createCategoriaProducto(formValue)
  //       .subscribe({
  //         next: () => {
  //           this.categoriaGuardada.emit(); // Emitimos evento
  //           this.showSuccess('Registro almacenado correctamente');
  //         },
  //         error: (error) => console.error('Error al crear:', error),
  //       });
  //   }
  //   // this.resetForm();
  //   setTimeout(() => {
  //     this.resetForm();
  //   }, 500);
  // }

  // resetForm(): void {
  //   this.categoriaForm.reset(); // Resetea los valores

  //   // Se asegura de que el formulario esté limpio
  //   this.categoriaForm.markAsPristine();
  //   this.categoriaForm.markAsUntouched();

  //   // Salimos del modo edición
  //   this.isEditMode = false;
  // }

  resetForm(): void {
    this.categoriaForm.reset();

    this.categoriaForm.markAsPristine();
    this.categoriaForm.markAsUntouched();

    this.isEditMode = false;
    this.categoriaEditada = null;
  }
  showSuccess(msg: any) {
    this.toastr.success(msg);
  }
  showError(msg: any) {
    this.toastr.error(msg);
  }
}
