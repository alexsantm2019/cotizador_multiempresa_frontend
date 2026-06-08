import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/services/gps/auth/auth.service';

@Pipe({ name: 'imageUrl', standalone: true })
export class ImageUrlPipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  transform(relativePath: string | undefined | null): string {
    if (!relativePath?.trim()) {
      return '/assets/images/profile/user5.jpg'; // Imagen por defecto
    }
    // Si ya es una URL completa o data URI
    if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
      return relativePath;
    }
    // Concatena con la URL base del servidor de imágenes
    return `${this.authService.apiUrlImagen}/${relativePath}`;
  }
}
