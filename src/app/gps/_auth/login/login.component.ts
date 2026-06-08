import { Component, inject } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { AuthService } from 'src/app/services/gps/auth/auth.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    // BrandingComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  private toastr = inject(ToastrService);
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  login() {
    if (this.form.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      this.form.markAllAsTouched();
      return;
    }
    const { uname, password } = this.form.getRawValue();

    if (!uname || !password) {
      console.error('Username or password is missing');
      return;
    }

    this.authService.login(uname, password).subscribe(
      () => {
        // console.log('CORRECTO');
        // this.router.navigate(['/apps/prueba']);
        this.router.navigate(['/dashboards/dashboard1']);
      },
      (error) => {
        console.error('Error en el login', error);
        this.showError(error.statusText);
        this.clearFields();
      }
    );
  }

  clearFields(){ 
      this.form.reset();
      this.form.markAsUntouched();
      this.form.markAsPristine();
  }

  submit() {
    console.log('Intentando loguearse....');
    console.log(this.form.value);
    // this.router.navigate(['/dashboards/dashboard1']);
  }

  showError(msg: any) {
    this.toastr.error(msg);
  }
}
