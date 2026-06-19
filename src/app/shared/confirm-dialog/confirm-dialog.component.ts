// src/app/shared/components/confirm-dialog/confirm-dialog.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'warn' | 'accent';
  icon?: string; // ⭐ Icono para el diálogo
  iconColor?: string; // ⭐ Color del icono
  showCancel?: boolean; // ⭐ Mostrar/ocultar botón cancelar
  type?: 'warning' | 'danger' | 'info' | 'success'; // ⭐ Tipo de diálogo
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  // ⭐ Valores por defecto
  get icon(): string {
    return this.data.icon || this.getDefaultIcon();
  }

  get iconColor(): string {
    return this.data.iconColor || this.getDefaultIconColor();
  }

  get type(): string {
    return this.data.type || this.getDefaultType();
  }

  private getDefaultIcon(): string {
    switch (this.data.confirmColor) {
      case 'warn':
        return 'alert-triangle';
      case 'primary':
        return 'info-circle';
      case 'accent':
        return 'check-circle';
      default:
        return 'alert-circle';
    }
  }

  private getDefaultIconColor(): string {
    switch (this.data.confirmColor) {
      case 'warn':
        return '#ef4444';
      case 'primary':
        return '#3b82f6';
      case 'accent':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  }

  private getDefaultType(): string {
    switch (this.data.confirmColor) {
      case 'warn':
        return 'danger';
      case 'primary':
        return 'info';
      case 'accent':
        return 'success';
      default:
        return 'warning';
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
