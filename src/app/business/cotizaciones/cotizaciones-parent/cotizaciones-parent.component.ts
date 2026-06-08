// angular import
import {
  AfterViewInit,
  OnInit,
  ViewChild,
  inject,
  TemplateRef,
  Input,
} from '@angular/core';
import { Component } from '@angular/core';

// project import
import { CotizadorFormComponent } from '../cotizacion-form/cotizacion-form.component';
import { ListaCotizacionesComponent } from '../lista-cotizaciones/lista-cotizaciones.component';

import { years } from '../../../core/utils/filtros';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [
    ListaCotizacionesComponent,
    CotizadorFormComponent,
    CommonModule,
    ReactiveFormsModule,

    ListaCotizacionesComponent,
    CotizadorFormComponent,

    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './cotizaciones-parent.component.html',
  styleUrls: ['./cotizaciones-parent.component.scss'],
})
export class CotizacionesParentComponent implements OnInit {
  // @ViewChild('listaCotizaciones') listaCotizaciones: ListaCotizacionesComponent | undefined;
  @Input() cotizacionExistente: any = null;
  cotizacionSeleccionada: any = null;
  filterForm: FormGroup;
  years = years;
  selectedYear: number = new Date().getFullYear();
  refreshTrigger = 0;
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      //month: [new Date().getMonth() + 1], // Mes actual
      year: [new Date().getFullYear()], // Año actual
    });
  }

  ngOnInit(): void {
    this.selectedYear = this.filterForm.get('year')?.value;
  }

  actualizarListaCotizaciones(): void {
    this.selectedYear = this.filterForm.get('year')?.value;
    this.refreshTrigger++;
  }

  editarCotizacion(cotizacion: any): void {
    this.cotizacionSeleccionada = cotizacion;
  }
}
