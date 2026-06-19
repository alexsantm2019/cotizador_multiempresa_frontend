// src/app/business/empresas/nueva-empresa/nueva-empresa.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EmpresasService } from '../../../core/services/empresas/empresas.service';
import { EmpresaInterface } from '../../../core/models/empresas.models';
import { ImageUrlPipe } from '../../../core/pipe/image/image-url.pipe';

@Component({
  selector: 'app-nueva-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TablerIconsModule,
    ImageUrlPipe,
  ],
  templateUrl: './nueva-empresa.component.html',
  styleUrls: ['./nueva-empresa.component.scss'],
})
export class NuevaEmpresaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  empresaForm!: FormGroup;
  isEditMode = false;
  empresaId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  // Opciones para el select de planes
  planes = [
    { value: 'free', label: 'Free' },
    { value: 'basic', label: 'Basic' },
    { value: 'premium', label: 'Premium' },
  ];

  // Archivo de logo
  logoFile: File | null = null;
  logoPreview: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadEmpresaIfEdit();
  }

  /**
   * Inicializar formulario
   */
  initForm(): void {
    this.empresaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      ruc: ['', [Validators.maxLength(13)]],
      direccion: ['', [Validators.maxLength(200)]],
      telefono: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      plan: ['basic'],
      max_usuarios: [5, [Validators.required, Validators.min(1)]],
      estado: [true],
    });
  }

  /**
   * Cargar empresa si es edición
   */
  loadEmpresaIfEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.empresaId = parseInt(id, 10);
        this.loadEmpresa(this.empresaId);
      }
    });
  }

  /**
   * Cargar empresa para edición
   */
  loadEmpresa(id: number): void {
    this.isLoading = true;
    this.empresaService.getEmpresaById(id).subscribe({
      next: (empresa) => {
        this.empresaForm.patchValue({
          nombre: empresa.nombre,
          ruc: empresa.ruc || '',
          direccion: empresa.direccion || '',
          telefono: empresa.telefono || '',
          email: empresa.email || '',
          plan: empresa.plan || 'basic',
          max_usuarios: empresa.max_usuarios || 5,
          estado: empresa.estado,
        });

        // Si tiene logo, mostrar preview
        if (empresa.logo) {
          this.logoPreview = empresa.logo;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar empresa:', error);
        this.toastr.error('Error al cargar los datos de la empresa');
        this.isLoading = false;
      },
    });
  }

  /**
   * Manejar selección de archivo de logo
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logoFile = input.files[0];

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.logoFile);
    }
  }

  /**
   * Eliminar logo
   */
  removeLogo(): void {
    this.logoFile = null;
    this.logoPreview = null;
    // Limpiar el input file
    const fileInput = document.getElementById('logoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Guardar empresa
   */
  onSubmit(): void {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      this.toastr.warning('Por favor, completa todos los campos requeridos');
      return;
    }

    this.isSubmitting = true;

    // ⭐ Crear FormData para enviar archivos
    const formData = new FormData();
    const formValues = this.empresaForm.value;

    // Agregar todos los campos al FormData
    Object.keys(formValues).forEach((key) => {
      if (
        formValues[key] !== null &&
        formValues[key] !== undefined &&
        formValues[key] !== ''
      ) {
        formData.append(key, formValues[key]);
      }
    });

    // ⭐ Agregar logo si existe
    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }

    if (!this.isEditMode) {
      // ⭐ Crear empresa enviando FormData
      this.empresaService.createEmpresa(formData).subscribe({
        next: () => {
          this.toastr.success('Empresa creada correctamente');
          this.router.navigate(['/business/empresas']);
        },
        error: (error) => {
          console.error('Error al crear empresa:', error);
          this.handleError(error);
          this.isSubmitting = false;
        },
      });
    } else {
      // ⭐ Actualizar empresa enviando FormData
      this.empresaService.updateEmpresa(this.empresaId!, formData).subscribe({
        next: () => {
          this.toastr.success('Empresa actualizada correctamente');
          this.router.navigate(['/business/empresas']);
        },
        error: (error) => {
          console.error('Error al actualizar empresa:', error);
          this.handleError(error);
          this.isSubmitting = false;
        },
      });
    }
  }
  // onSubmit(): void {
  //   if (this.empresaForm.invalid) {
  //     this.empresaForm.markAllAsTouched();
  //     this.toastr.warning('Por favor, completa todos los campos requeridos');
  //     return;
  //   }

  //   this.isSubmitting = true;
  //   const formData = { ...this.empresaForm.value };

  //   // Si no hay archivo de logo, no lo enviamos
  //   const formDataToSend = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     if (formData[key] !== null && formData[key] !== undefined) {
  //       formDataToSend.append(key, formData[key]);
  //     }
  //   });

  //   // Agregar logo si existe
  //   if (this.logoFile) {
  //     formDataToSend.append('logo', this.logoFile);
  //   }

  //   if (!this.isEditMode) {
  //     // Crear empresa
  //     this.empresaService.createEmpresa(formData).subscribe({
  //       next: () => {
  //         this.toastr.success('Empresa creada correctamente');
  //         this.router.navigate(['/business/empresas']);
  //       },
  //       error: (error) => {
  //         console.error('Error al crear empresa:', error);
  //         this.handleError(error);
  //         this.isSubmitting = false;
  //       },
  //     });
  //   } else {
  //     // Actualizar empresa
  //     this.empresaService.updateEmpresa(this.empresaId!, formData).subscribe({
  //       next: () => {
  //         this.toastr.success('Empresa actualizada correctamente');
  //         this.router.navigate(['/business/empresas']);
  //       },
  //       error: (error) => {
  //         console.error('Error al actualizar empresa:', error);
  //         this.handleError(error);
  //         this.isSubmitting = false;
  //       },
  //     });
  //   }
  // }

  /**
   * Manejar errores de la API
   */
  private handleError(error: any): void {
    if (error.error && typeof error.error === 'object') {
      const errors = error.error;
      Object.keys(errors).forEach((key) => {
        const messages = Array.isArray(errors[key])
          ? errors[key]
          : [errors[key]];
        messages.forEach((msg: string) => {
          this.toastr.error(`${key}: ${msg}`);
        });
      });
    } else {
      this.toastr.error('Error al procesar la solicitud');
    }
    this.isSubmitting = false;
  }

  /**
   * Cancelar y volver
   */
  cancel(): void {
    this.router.navigate(['/business/empresas']);
  }

  /**
   * Obtener mensaje de error para el campo
   */
  getErrorMessage(fieldName: string): string {
    const control = this.empresaForm.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (fieldName === 'nombre' && errors['maxlength']) {
      return 'El nombre no puede tener más de 100 caracteres';
    }

    if (fieldName === 'ruc' && errors['maxlength']) {
      return 'El RUC no puede tener más de 13 caracteres';
    }

    if (fieldName === 'email' && errors['email']) {
      return 'Ingresa un email válido';
    }

    if (fieldName === 'max_usuarios' && errors['min']) {
      return 'Debe tener al menos 1 usuario';
    }

    return '';
  }
}
