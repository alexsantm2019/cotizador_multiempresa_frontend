// angular imports
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TrackByFunction,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// third party
import { ToastrService } from 'ngx-toastr';

// components
import { CotizadorFormComponent } from '../cotizacion-form/cotizacion-form.component';

// services
import { AuthService } from '../../../core/services/auth/auth.service';
import { CotizacionesService } from '../../../core/services/cotizador/cotizador.service';
import { ClientesService } from '../../../core/services/clientes/clientes.service';

// models
import { CotizacionInterface } from '../../../core/models/cotizaciones.model';
import { ClientesInterface } from '../../../core/models/clientes.model';
import { MatIcon } from '@angular/material/icon';
import { MatChip } from '@angular/material/chips';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { TablerIconComponent } from 'angular-tabler-icons';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-lista-cotizaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    CotizadorFormComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTableModule,
    TablerIconComponent,
    MatTooltipModule,
  ],
  templateUrl: './lista-cotizaciones.component.html',
  styleUrls: ['./lista-cotizaciones.component.scss'],
})
export class ListaCotizacionesComponent implements OnInit, OnChanges {
  // =========================
  // INPUTS / OUTPUTS
  // =========================

  @Input() year!: number;
  @Input() refreshTrigger!: number;
  @Output() editarCotizacionEvent = new EventEmitter<any>();

  // =========================
  // INJECTIONS
  // =========================
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private cotizacionService = inject(CotizacionesService);
  private clientesService = inject(ClientesService);
  private dialog = inject(MatDialog);

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  // =========================
  // SIGNALS
  // =========================

  isLoading = signal(false);
  hasMoreData = signal(true);
  filtrosActivos = signal(false);
  clientes = signal<ClientesInterface[]>([]);
  groupedByMonth = signal<any[]>([]);
  groupedByMonthFiltrado = signal<any[]>([]);
  mostrarFormulario = signal(false);
  cotizacionSeleccionada = signal<CotizacionInterface | null>(null);

  // =========================
  // COMPUTED
  // =========================

  displayedMonths = computed(() =>
    this.filtrosActivos()
      ? this.groupedByMonthFiltrado()
      : this.groupedByMonth(),
  );

  // =========================
  // VARIABLES
  // =========================

  currentPage = 1;
  totalPages = 1;
  pageSize = 20;
  visibleDetallesId: number | null = null;
  filtroFecha: string | null = null;
  filtroCliente: number | null = null;
  mesesCargando: { [monthKey: string]: boolean } = {};
  paginasPorMes: { [monthKey: string]: number } = {};

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor() {}

  // =========================
  // LIFECYCLE
  // =========================

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    this.getClientes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.empresaId = this.authService.getEmpresaId();
    if (changes['year']?.currentValue || changes['refreshTrigger']) {
      this.currentPage = 1;
      this.getCotizaciones();
    }
  }

  // =========================
  // TRACKBY
  // =========================

  trackByCotizacionId: TrackByFunction<any> = (_: number, item: any) => item.id;

  trackByMonthKey: TrackByFunction<any> = (_: number, item: any) =>
    item.month_key;

  isExpansionDetailRow = (index: number, row: CotizacionInterface): boolean => {
    return this.isDetalleVisible(row.id);
  };

  // =========================
  // CLIENTES
  // =========================

  getClientes(): void {
    let id = this.empresaId!;
    this.clientesService.getClientesByEmpresaId(id).subscribe({
      next: (data) => {
        const clientesOrdenados = [...data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre),
        );
        this.clientes.set(clientesOrdenados);
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
      },
    });
  }

  // =========================
  // COTIZACIONES
  // =========================

  getCotizaciones(): void {
    if (!this.year) return;
    this.isLoading.set(true);
    let month: number | null = null;
    if (this.filtroFecha) {
      const [, mes] = this.filtroFecha.split('-').map(Number);
      month = mes;
    }
    let id = this.empresaId!;
    console.log('📅 Cargando cotizaciones para:', {
      year: this.year,
      month,
      empresaId: id,
    });
    this.cotizacionService
      .getCotizacionesAgrupadasByEmpresaId(
        id,
        this.year,
        month,
        this.currentPage,
        this.pageSize,
      )
      .subscribe({
        next: (response: any) => {
          const mesesFiltrados = (response.data || [])

            .map((mes: any) => {
              const cotizacionesValidas = (mes.cotizaciones || []).filter(
                (cot: any) =>
                  cot.nombre_evento && cot.nombre_evento.trim() !== '',
              );
              return {
                ...mes,
                cotizaciones: cotizacionesValidas,
                total_en_mes: mes.total_en_mes || cotizacionesValidas.length,
                tiene_mas:
                  (mes.total_en_mes || cotizacionesValidas.length) >
                  this.pageSize,
              };
            })
            .filter((mes: any) => mes.cotizaciones.length > 0);

          // RESET
          if (this.currentPage === 1) {
            this.groupedByMonth.set([]);
            this.groupedByMonth.set(mesesFiltrados);
            this.groupedByMonth().forEach((mes) => {
              this.paginasPorMes[mes.month_key] = 1;
            });
          } else {
            this.groupedByMonth.update((months) => {
              const nuevos = [...months];
              mesesFiltrados.forEach((nuevoMes: any) => {
                const existe = nuevos.find(
                  (m) => m.month_key === nuevoMes.month_key,
                );
                if (!existe) {
                  nuevos.push(nuevoMes);
                  this.paginasPorMes[nuevoMes.month_key] = 1;
                }
              });
              return nuevos;
            });
          }

          // ordenar meses
          this.groupedByMonth.update((months) =>
            [...months].sort((a, b) => {
              if (a.year !== b.year) {
                return b.year - a.year;
              }

              return b.month_number - a.month_number;
            }),
          );
          this.groupedByMonthFiltrado.set([...this.groupedByMonth()]);
          this.totalPages = response.pagination?.total_paginas_global || 1;
          this.hasMoreData.set(this.currentPage < this.totalPages);
          this.isLoading.set(false);
        },

        error: (error) => {
          console.error('❌ Error cargando cotizaciones:', error);
          this.isLoading.set(false);
        },
      });
  }

  // =========================
  // CARGAR MÁS POR MES
  // =========================

  cargarMasPorMes(monthKey: string): void {
    if (this.mesesCargando[monthKey]) return;

    this.mesesCargando[monthKey] = true;

    const [year, month] = monthKey.split('-').map(Number);

    const paginaActual = this.paginasPorMes[monthKey] || 1;

    const siguientePagina = paginaActual + 1;

    this.cotizacionService
      .getCotizacionesPorMes(year, month, siguientePagina, this.pageSize)
      .subscribe({
        next: (response: any) => {
          const mesExistente = this.groupedByMonth().find(
            (m) => m.month_key === monthKey,
          );

          if (mesExistente && response.data && response.data.length > 0) {
            const nuevasCotizaciones = response.data.filter(
              (cot: any) =>
                cot.nombre_evento && cot.nombre_evento.trim() !== '',
            );

            mesExistente.cotizaciones = [
              ...mesExistente.cotizaciones,
              ...nuevasCotizaciones,
            ];

            mesExistente.tiene_mas = response.pagination?.tiene_mas;

            this.groupedByMonth.update((months) => [...months]);
          }

          this.paginasPorMes[monthKey] = siguientePagina;

          this.mesesCargando[monthKey] = false;
        },

        error: (error) => {
          console.error(error);

          this.mesesCargando[monthKey] = false;
        },
      });
  }

  // =========================
  // FILTROS
  // =========================

  aplicarFiltros(): void {
    this.filtrosActivos.set(!!this.filtroCliente || !!this.filtroFecha);

    if (!this.filtroCliente && !this.filtroFecha) {
      this.groupedByMonthFiltrado.set([...this.groupedByMonth()]);

      return;
    }

    this.groupedByMonthFiltrado.set(this.filtrarCotizaciones());
  }

  filtrarCotizaciones() {
    return this.groupedByMonth()

      .map((grupo: any) => {
        const cotizacionesFiltradas = grupo.cotizaciones.filter((cot: any) => {
          // FILTRO CLIENTE
          if (this.filtroCliente && cot.cliente?.id !== this.filtroCliente) {
            return false;
          }

          // FILTRO FECHA
          if (this.filtroFecha) {
            const fecha = new Date(cot.fecha_evento);

            const fechaUTC = fecha.toISOString().split('T')[0];

            if (fechaUTC !== this.filtroFecha) {
              return false;
            }
          }

          return true;
        });

        return {
          ...grupo,

          cotizaciones: cotizacionesFiltradas,
        };
      })

      .filter((grupo: any) => grupo.cotizaciones.length > 0);
  }

  limpiarFiltros(): void {
    this.filtroFecha = null;
    this.filtroCliente = null;
    this.filtrosActivos.set(false);
    this.groupedByMonthFiltrado.set([...this.groupedByMonth()]);
  }

  // =========================
  // DETALLES
  // =========================

  isDetalleVisible(id: number): boolean {
    return this.visibleDetallesId === id;
  }

  toggleDetalles(id: number): void {
    this.visibleDetallesId = this.visibleDetallesId === id ? null : id;
  }

  // =========================
  // FORMULARIO
  // =========================

  // editarCotizacion(cotizacion: CotizacionInterface): void {
  //   console.log('✏️ Editando:', cotizacion);

  //   this.cotizacionSeleccionada.set(cotizacion);

  //   this.mostrarFormulario.set(true);
  // }

  editarCotizacion(cotizacion: any): void {
    const dialogRef = this.dialog.open(CotizadorFormComponent, {
      width: '95vw',
      maxWidth: '1400px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      panelClass: 'cotizacion-dialog',
      data: {
        isEditMode: true,
        cotizacionExistente: cotizacion,
      },
    });

    dialogRef.afterClosed().subscribe((result: { success: any }) => {
      if (result?.success) {
        this.getCotizaciones();
      }
    });
  }

  onCotizacionGuardada(): void {
    this.mostrarFormulario.set(false);

    this.cotizacionSeleccionada.set(null);

    this.getCotizaciones();
  }

  onModalCerrado(): void {
    this.mostrarFormulario.set(false);

    this.cotizacionSeleccionada.set(null);
  }

  // =========================
  // PAGINACIÓN GLOBAL
  // =========================

  cargarMas(): void {
    if (this.hasMoreData() && !this.isLoading()) {
      this.currentPage++;

      this.getCotizaciones();
    }
  }

  // =========================
  // ELIMINAR
  // =========================

  deleteCotizacion(id: number): void {
    this.cotizacionService.deleteCotizacion(id).subscribe({
      next: () => {
        this.showSuccess('Registro eliminado correctamente');

        this.getCotizaciones();
      },

      error: (error) => {
        console.error(error);

        this.showError('Error al eliminar la cotización');
      },
    });
  }

  // =========================
  // PDF
  // =========================

  downloadPDF(id: number): void {
    this.cotizacionService.downloadPDF(id).subscribe({
      next: (response) => {
        const blob = response.body as Blob;
        const fileURL = URL.createObjectURL(blob);
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'cotizacion.pdf';
        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/i.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(fileURL);
        this.showSuccess(
          `Cotización descargada correctamente como ${fileName}`,
        );
      },
      error: (error) => {
        console.error(error);
        this.showError('Error al descargar PDF');
      },
    });
  }

  // =========================
  // TOAST
  // =========================

  showSuccess(msg: string): void {
    this.toastr.success(msg);
  }

  showError(msg: string): void {
    this.toastr.error(msg);
  }
}
