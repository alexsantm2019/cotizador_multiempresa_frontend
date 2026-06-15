import { Component, inject, signal } from '@angular/core';

import { CongratulateCardComponent } from './congratulate-card/congratulate-card.component';
import { CotizacionesCardComponent } from './cotizaciones-card/cotizaciones-card.component';
import { ProductoCardComponent } from './producto-card/producto-card.component';
import { ClientesCardComponent } from './clientes-card/clientes-card.component';
import { CotizacionInterface } from 'src/app/core/models/cotizaciones.model';
import { CotizacionesService } from 'src/app/core/services/cotizador/cotizador.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CongratulateCardComponent,
    CotizacionesCardComponent,
    ProductoCardComponent,
    ClientesCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  cotizaciones = signal<CotizacionInterface[]>([]);
  year = new Date().getFullYear();
  private cotizacionService = inject(CotizacionesService);
  private authService = inject(AuthService);
  empresaId: number | null = null;

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    this.getResumenCotizaciones();
  }
  getResumenCotizaciones(): void {
    console.log("Consumiendo api de cotizaciones....")
    let id = this.empresaId!;
    this.cotizacionService
      .getCotizacionesAgrupadasByEmpresaId(id, this.year, null, 1, 1000)
      .subscribe({
        next: (response: any) => {
          this.cotizaciones.set(response.data || []);          
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
