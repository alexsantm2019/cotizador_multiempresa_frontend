// src/app/services/jwt-utils.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtUtilsService {
  // Decodifica el token JWT sin verificar la firma (para obtener el payload)
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }
  // // Verifica si el token tiene estructura de JWT (header.payload.signature)
  getTokenExpiration(token: string): number | null {
    if (!this.isJWT(token)) {
      console.log('Intento de decodificar un token que no es JWT');
      return null;
    }
    const decoded = this.decodeToken(token);
    return decoded ? decoded.exp * 1000 : null; // Convierte segundos a ms
  }
  private isJWT(token: string): boolean {
    return typeof token === 'string' && token.split('.').length === 3;
  }

  // Obtiene la fecha de expiración del token (en milisegundos)
}
