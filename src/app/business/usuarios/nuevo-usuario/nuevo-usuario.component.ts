// src/app/business/usuarios/nuevo-usuario/nuevo-usuario.component.ts

import { Component, OnInit, inject } from '@angular/core';
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
import { UsuariosService } from '../../../core/services/usuarios/usuarios.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-nuevo-usuario',
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
  ],
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss'],
})
export class NuevoUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  usuarioForm!: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  empresaId: number | null = null;

  ngOnInit(): void {
    // Obtener empresaId del usuario logueado
    this.empresaId = this.authService.getEmpresaId();
    this.initForm();
    this.loadUsuarioIfEdit();
  }

  /**
   * Inicializar formulario
   */
  initForm(): void {
    this.usuarioForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        is_active: [true],
        is_staff: [false],
        is_superuser: [false],
        // ⭐ empresa_id se asigna automáticamente, no en el formulario
      },
      { validators: this.passwordMatchValidator },
    );
  }

  /**
   * Validar que las contraseñas coincidan
   */
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm_password')?.value;

    if (password || confirm) {
      return password === confirm ? null : { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Cargar usuario si es edición
   */
  loadUsuarioIfEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = parseInt(id, 10);
        this.loadUsuario(this.userId);
      }
    });
  }

  /**
   * Cargar usuario para edición
   */
  loadUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (user) => {
        this.usuarioForm.patchValue({
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_active: user.is_active,
          is_staff: user.is_staff,
          is_superuser: user.is_superuser,
        });

        // En edición, la contraseña es opcional
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm
          .get('password')
          ?.setValidators([Validators.minLength(6)]);
        this.usuarioForm.get('password')?.updateValueAndValidity();

        this.usuarioForm.get('confirm_password')?.clearValidators();
        this.usuarioForm.get('confirm_password')?.updateValueAndValidity();

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.toastr.error('Error al cargar los datos del usuario');
        this.isLoading = false;
      },
    });
  }

  /**
   * Guardar usuario
   */
  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.toastr.warning('Por favor, completa todos los campos requeridos');
      return;
    }

    this.isLoading = true;
    const formData = { ...this.usuarioForm.value };
    delete formData.confirm_password;

    // ⭐ Asignar empresa_id automáticamente
    formData.empresa_id = this.empresaId;

    // Si es edición y no tiene contraseña, la eliminamos
    if (this.isEditMode && !formData.password) {
      delete formData.password;
    }

    if (!this.isEditMode) {
      // Crear usuario
      this.usuarioService.createUsuario(formData).subscribe({
        next: () => {
          this.toastr.success('Usuario creado correctamente');
          this.router.navigate(['/business/usuarios']);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.handleError(error);
          this.isLoading = false;
        },
      });
    } else {
      // Actualizar usuario
      this.usuarioService.updateUsuario(this.userId!, formData).subscribe({
        next: () => {
          this.toastr.success('Usuario actualizado correctamente');
          this.router.navigate(['/business/usuarios']);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.handleError(error);
          this.isLoading = false;
        },
      });
    }
  }

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
  }

  /**
   * Cancelar y volver
   */
  cancel(): void {
    this.router.navigate(['/business/usuarios']);
  }

  /**
   * Obtener mensaje de error para el campo
   */
  getErrorMessage(fieldName: string): string {
    const control = this.usuarioForm.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (fieldName === 'password' && errors['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (fieldName === 'username' && errors['minlength']) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (fieldName === 'email' && errors['email']) {
      return 'Ingresa un email válido';
    }

    if (
      fieldName === 'confirm_password' &&
      this.usuarioForm.errors?.['passwordMismatch']
    ) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }
}
