// import { Pipe, PipeTransform } from '@angular/core';
// import { AuthService } from 'src/app/core/services/auth/auth.service';

// @Pipe({ name: 'imageUrl', standalone: true })
// export class ImageUrlPipe implements PipeTransform {
//   constructor(private authService: AuthService) {}

//   transform(relativePath: string | undefined | null): string {
//     if (!relativePath?.trim()) {
//       return '/assets/images/profile/user5.jpg'; // Imagen por defecto
//     }
//     // Si ya es una URL completa o data URI
//     if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
//       return relativePath;
//     }
//     // Concatena con la URL base del servidor de imágenes
//     return `${this.authService.apiUrlImagen}/${relativePath}`;
//   }
// }

// shared/pipes/image-url.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../core/environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true,
})
export class ImageUrlPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    apiType: 'main' | 'profiles' = 'main',
  ): string {
    // Si no hay valor o es string vacío, retorna una imagen por defecto
    if (!value) {
      return 'assets/images/default-logo.svg';
    }

    // Si ya es una URL completa (http:// o https://), retornarla tal cual
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // Si la ruta ya comienza con 'assets/', usarla directamente
    if (value.startsWith('assets/')) {
      return value;
    }

    // Seleccionar qué API usar
    const baseUrl =
      apiType === 'profiles' ? environment.apiUrlProfiles : environment.apiUrl;

    // Asegurar que no haya doble slash
    const cleanPath = value.startsWith('/') ? value : '/' + value;

    return `${baseUrl}${cleanPath}`;
  }
}
