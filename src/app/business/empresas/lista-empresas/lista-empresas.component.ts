// src/app/business/empresas/lista-empresas/lista-empresas.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EmpresasService } from '../../../core/services/empresas/empresas.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EmpresaInterface } from '../../../core/models/empresas.models';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ImageUrlPipe } from '../../../core/pipe/image/image-url.pipe';

@Component({
  selector: 'app-lista-empresas',
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
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    TablerIconsModule,
    ImageUrlPipe,
  ],
  templateUrl: './lista-empresas.component.html',
  styleUrls: ['./lista-empresas.component.scss'],
})
export class ListaEmpresasComponent implements OnInit {
  private empresasService = inject(EmpresasService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  // Signals
  empresas = signal<EmpresaInterface[]>([]);
  isLoading = signal<boolean>(false);
  searchTerm = signal<string>('');
  esSuperadmin = signal<boolean>(false);

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Columnas de la tabla
  displayedColumns: string[] = [
    'nombre',
    'ruc',
    'telefono',
    'email',
    'plan',
    'max_usuarios',
    'estado',
    'acciones',
  ];

  ngOnInit(): void {
    this.verificarPermisos();
    this.loadEmpresas();
  }

  /**
   * Verificar si el usuario es superadmin
   */
  verificarPermisos(): void {
    const user = this.authService.getCurrentUser();
    this.esSuperadmin.set(user?.is_superuser || false);
  }

  /**
   * Cargar empresas desde el servicio
   */
  loadEmpresas(): void {
    this.isLoading.set(true);

    // Si es superadmin, usar el endpoint de todas las empresas
    // if (this.esSuperadmin()) {
    this.empresasService.getTodasEmpresas().subscribe({
      next: (response) => {
        // La respuesta tiene { success: true, count: X, data: [...] }
        const empresas = response?.data || response || [];
        this.empresas.set(empresas);
        this.totalItems = empresas.length;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        this.toastr.error('Error al cargar la lista de empresas');
        this.isLoading.set(false);
      },
    });
    // } else {
    //   // Usuario normal: solo empresas activas (no eliminadas)
    //   this.empresasService
    //     .getEmpresas({
    //       search: this.searchTerm() || undefined,
    //       page: this.currentPage,
    //       page_size: this.pageSize,
    //     })
    //     .subscribe({
    //       next: (data) => {
    //         this.empresas.set(data);
    //         this.totalItems = data.length;
    //         this.isLoading.set(false);
    //       },
    //       error: (error) => {
    //         console.error('Error al cargar empresas:', error);
    //         this.toastr.error('Error al cargar la lista de empresas');
    //         this.isLoading.set(false);
    //       },
    //     });
    // }
  }

  /**
   * Buscar empresas
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage = 1;
    this.loadEmpresas();
  }

  /**
   * Cambiar página
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadEmpresas();
  }

  /**
   * Crear nueva empresa
   */
  nuevaEmpresa(): void {
    this.router.navigate(['/business/empresas/nuevo']);
  }

  /**
   * Editar empresa
   */
  editarEmpresa(id: number): void {
    this.router.navigate(['/business/empresas/editar', id]);
  }

  /**
   * Ver detalle de empresa
   */
  verEmpresa(id: number): void {
    this.router.navigate(['/business/empresas/ver', id]);
  }

  /**
   * Eliminar empresa con confirmación
   */
  eliminarEmpresa(id: number, nombre: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar la empresa "${nombre}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.empresasService.deleteEmpresa(id).subscribe({
          next: () => {
            this.toastr.success('Empresa eliminada correctamente');
            this.loadEmpresas();
          },
          error: (error) => {
            console.error('Error al eliminar empresa:', error);
            this.toastr.error('Error al eliminar la empresa');
            this.isLoading.set(false);
          },
        });
      }
    });
  }

  /**
   * Activar/Desactivar empresa
   */
  toggleEmpresaStatus(id: number, estado: boolean): void {
    const action = estado ? 'activar' : 'desactivar';
    const message = `¿Estás seguro de que deseas ${action} esta empresa?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `Confirmar ${action}`,
        message: message,
        confirmText: estado ? 'Activar' : 'Desactivar',
        cancelText: 'Cancelar',
        confirmColor: estado ? 'primary' : 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.set(true);
        this.empresasService.toggleEmpresaStatus(id, estado).subscribe({
          next: () => {
            this.toastr.success(
              `Empresa ${estado ? 'activada' : 'desactivada'} correctamente`,
            );
            this.loadEmpresas();
          },
          error: (error) => {
            console.error(
              `Error al ${estado ? 'activar' : 'desactivar'} empresa:`,
              error,
            );
            this.toastr.error(
              `Error al ${estado ? 'activar' : 'desactivar'} la empresa`,
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
    this.loadEmpresas();
  }

  /**
   * Obtener el texto del plan
   */
  getPlanText(plan: string): string {
    const plans: { [key: string]: string } = {
      free: 'Free',
      basic: 'Basic',
      premium: 'Premium',
    };
    return plans[plan] || plan || 'N/A';
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Mostrar el avatar en su lugar
    const parent = img.parentElement;
    if (parent) {
      const avatar = document.createElement('div');
      avatar.className = 'empresa-avatar';
      avatar.style.backgroundColor = '#6c757d';
      avatar.textContent = parent.getAttribute('data-nombre')?.charAt(0).toUpperCase() || 'E';
      img.replaceWith(avatar);
    }
  }
}
