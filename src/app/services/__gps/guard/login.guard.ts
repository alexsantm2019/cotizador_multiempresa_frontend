import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { Observable } from "node_modules/rxjs/dist/types/internal/Observable";
import { map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (!user) {
          return true;
        }
        return this.router.createUrlTree(['/apps/prueba']);
      })
    );
  }
}
