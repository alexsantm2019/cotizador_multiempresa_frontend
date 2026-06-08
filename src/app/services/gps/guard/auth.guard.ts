
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      console.log(
        'consultando a getToken en Guard: '
      );
      return true;
    } else {
      this.router.navigate(['/auth/login'], {
        skipLocationChange: true,
        replaceUrl: true,
      });
      return false;
    }
  }
}
