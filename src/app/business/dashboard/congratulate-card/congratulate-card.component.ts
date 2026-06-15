import { Component, computed, inject, input, Input, signal, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProductosService } from '../../../core/services/productos/productos.service';
import { ProductosInterface } from '../../../core/models/productos.model';
import { CotizacionesService } from '../../../core/services/cotizador/cotizador.service';
import { CotizacionInterface } from '../../../core/models/cotizaciones.model';
interface month {
  value: string;
  viewValue: string;
}

interface stats {
  id: number;
  color: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface revenueChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-congratulate-card',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './congratulate-card.component.html',
  styleUrl: './congratulate-card.component.scss',
})
export class CongratulateCardComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  cotizaciones = input<CotizacionInterface[]>([]);
  private productosService = inject(ProductosService);
  private cotizacionService = inject(CotizacionesService);
  productos = signal<ProductosInterface[]>([]);
  public revenueChart!: Partial<revenueChart> | any;
  year = new Date().getFullYear();
  months: month[] = [
    { value: 'mar', viewValue: 'March 2025' },
    { value: 'apr', viewValue: 'April 2025' },
    { value: 'june', viewValue: 'June 2025' },
  ];

  readonly coloresEstado = {
    primary: '#FDC4B1',
    warning: '#F8C684',
    success: '#4BD08B',
    error: '#FA896B',
  };
  private authService = inject(AuthService);
  empresaId: number | null = null;
  currentUser: any;
  fullName: string | null = null;
  cdr: any;
  markers: {
    size: 8;
  };
  constructor() {
    this.revenueChart = {
      series: [
        {
          name: '',
          data: [0, 20, 15, 19, 14, 25, 32],
          color: 'var(--mat-sys-primary)',
        },
        {
          name: '',
          data: [0, 12, 19, 13, 26, 16, 25],
          color: '#46caeb',
        },
      ],

      chart: {
        type: 'bar',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 260,
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
        },
      },

      legend: {
        show: true,
        position: 'top',
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: 'rgba(0,0,0,0.1)',
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        labels: {
          show: true,
        },
        type: 'category',
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (value: number) => {
            return `$ ${value.toFixed(2)}`;
          },
        },
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
        x: {
          show: false,
        },
        y: {
          formatter: (value: number) => {
            return `$ ${value.toFixed(2)}`;
          },
        },
      },
    };
  }

  stats = computed(() => {
    const meses = this.cotizaciones();

    let activos = 0;
    let porConfirmar = 0;
    let confirmados = 0;
    let cancelados = 0;

    meses.forEach((mes) => {
      mes.cotizaciones?.forEach((cotizacion: any) => {
        switch (cotizacion.estado_info?.item?.toLowerCase()) {
          case 'activo':
            activos++;
            break;
          case 'por confirmar':
            porConfirmar++;
            break;
          case 'confirmado':
            confirmados++;
            break;
          case 'cancelado':
            cancelados++;
            break;
        }
      });
    });
    return [
      {
        id: 1,
        color: 'primary',
        title: activos.toString(),
        subtitle: 'Activas',
        icon: 'clipboard-text',
      },
      {
        id: 2,
        color: 'warning',
        title: porConfirmar.toString(),
        subtitle: 'Por confirmar',
        icon: 'clock-hour-4',
      },
      {
        id: 3,
        color: 'success',
        title: confirmados.toString(),
        subtitle: 'Confirmadas',
        icon: 'circle-check',
      },
      {
        id: 4,
        color: 'error',
        title: cancelados.toString(),
        subtitle: 'Canceladas',
        icon: 'circle-x',
      },
    ];
  });

  ngOnInit(): void {
    this.fullName = this.authService.getFullName();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.cdr.detectChanges();
    });
    this.empresaId = this.authService.getEmpresaId();
    // this.getResumenCotizaciones();
  }

}



