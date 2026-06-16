// src/app/business/usuarios/lista-usuarios/lista-usuarios.component.ts

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { UsuariosService } from '../../../core/services/usuarios/usuarios.service';
import { User } from '../../../core/models/user.models';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TablerIconsModule,
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
})
export class ListaUsuariosComponent implements OnInit {
  private usuarioService = inject(UsuariosService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  // Signals
  usuarios = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  searchTerm = signal<string>('');

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Columnas de la tabla
  displayedColumns: string[] = [
    'usuario',
    'nombre',
    'email',
    'empresa',
    'estado',
    'rol',
    'acciones',
  ];

  ngOnInit(): void {
    this.loadUsuarios();
  }

  /**
   * Cargar usuarios desde el servicio
   */
  loadUsuarios(): void {
    this.isLoading.set(true);

    this.usuarioService
      .getUsuarios({
        search: this.searchTerm() || undefined,
        page: this.currentPage,
        page_size: this.pageSize,
      })
      .subscribe({
        next: (data) => {
          this.usuarios.set(data);
          // Si tu API retorna un objeto con count y results, ajusta aquí
          // this.totalItems = data.count;
          // this.usuarios.set(data.results);
          this.totalItems = data.length; // Temporal mientras ajustas
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.toastr.error('Error al cargar la lista de usuarios');
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Buscar usuarios
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage = 1;
    this.loadUsuarios();
  }

  /**
   * Cambiar página
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsuarios();
  }

  /**
   * Crear nuevo usuario
   */
  nuevoUsuario(): void {
    this.router.navigate(['/business/usuarios/nuevo']);
  }

  /**
   * Editar usuario
   */
  editarUsuario(id: number): void {
    this.router.navigate(['/business/usuarios/editar', id]);
  }

  /**
   * Eliminar usuario con confirmación
   */
  eliminarUsuario(id: number, nombre: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar al usuario "${nombre}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.toastr.success('Usuario eliminado correctamente');
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.toastr.error('Error al eliminar el usuario');
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  /**
   * Activar/Desactivar usuario
   */
  toggleUsuarioStatus(id: number, isActive: boolean): void {
    const action = isActive ? 'activar' : 'desactivar';
    const message = `¿Estás seguro de que deseas ${action} este usuario?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `Confirmar ${action}`,
        message: message,
        confirmText: isActive ? 'Activar' : 'Desactivar',
        cancelText: 'Cancelar',
        confirmColor: isActive ? 'primary' : 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.usuarioService.toggleUsuarioStatus(id, isActive).subscribe({
          next: () => {
            this.toastr.success(
              `Usuario ${isActive ? 'activado' : 'desactivado'} correctamente`,
            );
            this.loadUsuarios();
          },
          error: (error) => {
            console.error(
              `Error al ${isActive ? 'activar' : 'desactivar'} usuario:`,
              error,
            );
            this.toastr.error(
              `Error al ${isActive ? 'activar' : 'desactivar'} el usuario`,
            );
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  /**
   * Recargar lista
   */
  refresh(): void {
    this.loadUsuarios();
  }

  /**
   * Obtener iniciales del usuario para el avatar
   */
  getInitials(user: User): string {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    return user.username.charAt(0).toUpperCase();
  }

  /**
   * Obtener color para el avatar basado en el username
   */
  getAvatarColor(username: string): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E9',
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}
