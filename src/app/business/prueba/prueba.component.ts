// import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
// import { AuthService } from 'src/app/core/services/auth/auth.service';
// import { CommonModule } from '@angular/common';
// import { environment } from '../../core/environments/environment';

// @Component({
//   selector: 'app-prueba',
//   templateUrl: './prueba.component.html',
//   styleUrls: ['./prueba.component.scss'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class PruebaComponent implements OnInit {
//   currentUser: any;
//   accessToken: any;
//   refreshToken: any;
//   expiresAt: any;
//   refreshIn: any;
//   refreshInFormatted: any;
//   refreshInMs: any;
//   expiresAtFormatted: any;

//   private authService = inject(AuthService);
//   private cdr = inject(ChangeDetectorRef);

//   ngOnInit(): void {
//     this.authService.currentUser$.subscribe((user) => {
//       this.currentUser = user;
//       this.accessToken = this.authService.getToken();
//       this.refreshToken = this.authService.getRefreshToken();

//       // console.log('Usuario actual:', user);
//       // console.log('¿Existe usuario?', !!user);
//       this.cdr.detectChanges();

//       // Refresh In:

//       this.expiresAt = Number(this.authService.getExpiredAtToken());
//       const now = Date.now();
//       const refreshOffset = environment.tokenRefreshOffset;
//       const expiresDate = new Date(this.expiresAt);
//       this.expiresAtFormatted = expiresDate.toLocaleString();

//       // Diferencia en milisegundos hasta el refresh
//       const timeUntilExpiration = this.expiresAt - now;
//       this.refreshInMs = timeUntilExpiration - refreshOffset;

//       // Formatear en HH:MM:SS
//       const totalSeconds = Math.floor(this.refreshInMs / 1000);
//       const hours = Math.floor(totalSeconds / 3600);
//       const minutes = Math.floor((totalSeconds % 3600) / 60);
//       const seconds = totalSeconds % 60;
//       // const expiresDate = new Date(this.expiresAt);
//       this.expiresAtFormatted = `${expiresDate.getFullYear()}-${this.pad(
//         expiresDate.getMonth() + 1
//       )}-${this.pad(expiresDate.getDate())} ${this.pad(
//         expiresDate.getHours()
//       )}:${this.pad(expiresDate.getMinutes())}:${this.pad(
//         expiresDate.getSeconds()
//       )}`;
//       this.refreshInFormatted = this.formatDuration(this.refreshIn);

//       // Guardar string formateado para mostrar en el HTML
//       this.refreshInFormatted = `${this.pad(hours)}:${this.pad(
//         minutes
//       )}:${this.pad(seconds)}`;
//     });
//   }
//   private pad(num: number): string {
//     return num.toString().padStart(2, '0');
//   }
//   formatDuration(ms: number): string {
//     if (ms < 0) ms = 0; // Evitar negativos
//     const totalSeconds = Math.floor(ms / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
//     return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
//   }

//   logout() {
//     this.authService.logout();
//   }
// }
