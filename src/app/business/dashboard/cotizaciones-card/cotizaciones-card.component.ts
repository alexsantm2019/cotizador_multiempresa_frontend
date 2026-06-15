import { Component, computed, inject, input, Input, signal, ViewChild } from '@angular/core';
import { effect } from '@angular/core';
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
import { ProductosInterface } from '../../../core/models/productos.model';
import { CotizacionInterface } from '../../../core/models/cotizaciones.model';

interface month {
  value: string;
  viewValue: string;
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
  selector: 'app-cotizaciones-card',
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './cotizaciones-card.component.html',
  styleUrl: './cotizaciones-card.component.scss',
})
export class CotizacionesCardComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  cotizaciones = input<CotizacionInterface[]>([]);
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
    effect(() => {
      const data = this.cotizaciones();

      if (data.length) {
        this.buildChart(data);
      }
    });
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
        stacked: true,
        // sparkline: {
        //   enabled: true,
        // },
      },

      plotOptions: {
        // bar: {
        //   horizontal: false,
        //   columnWidth: '50%',
        // },
        bar: {
          borderRadius: 10,
          columnWidth: '50%',
          distributed: true,
          endingShape: 'rounded',
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


  ngOnInit(): void {
    // this.fullName = this.authService.getFullName();
    // this.authService.currentUser$.subscribe((user) => {
    //   this.currentUser = user;
    //   this.cdr.detectChanges();
    // });
    // this.empresaId = this.authService.getEmpresaId();
  }

  private buildChart(data: any[]): void {
    const categories: string[] = [];
    const activos: number[] = [];
    const porConfirmar: number[] = [];
    const confirmados: number[] = [];

    const sortedData = [...data].sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month_number - b.month_number;
    });

    sortedData.forEach((mes) => {
      categories.push(mes.month_name);
      let totalActivos = 0;
      let totalPorConfirmar = 0;
      let totalConfirmados = 0;
      (mes.cotizaciones || []).forEach((cotizacion: any) => {
        const estado = cotizacion.estado_info?.item?.toLowerCase();
        const total = Number(cotizacion.total || 0);
        switch (estado) {
          case 'activo':
            totalActivos += total;
            break;
          case 'por confirmar':
            totalPorConfirmar += total;
            break;
          case 'confirmado':
            totalConfirmados += total;
            break;
        }
      });
      activos.push(totalActivos);
      porConfirmar.push(totalPorConfirmar);
      confirmados.push(totalConfirmados);
    });

    this.revenueChart = {
      ...this.revenueChart,
      // dataLabels: {
      //   enabled: false,
      // },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          return `$${val.toFixed(2)}`;
        },
      },
      series: [
        {
          name: 'Activas',
          data: activos,
          color: this.coloresEstado.primary,
        },
        {
          name: 'Por confirmar',
          data: porConfirmar,
          color: this.coloresEstado.warning,
        },
        {
          name: 'Confirmadas',
          data: confirmados,
          color: this.coloresEstado.success,
        },
      ],
      xaxis: {
        ...this.revenueChart.xaxis,
        categories,
      },
    };
  }
}
