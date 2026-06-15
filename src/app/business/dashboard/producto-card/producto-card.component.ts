import {
  Component,
  computed,
  effect,
  input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApexChart,
  ChartComponent,
  ChartType,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexXAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ProductosInterface } from 'src/app/core/models/productos.model';

export interface productsChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  colors: string[];
}

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CommonModule, MaterialModule, NgApexchartsModule, TablerIconsModule],
  templateUrl: './producto-card.component.html',
  styleUrl: './producto-card.component.scss',
})
export class ProductoCardComponent implements AfterViewInit {
  productos = input<ProductosInterface[]>([]);

  @ViewChild('chart') chart!: ChartComponent;

  chartConfig: productsChart = this.getEmptyChartConfig();

  constructor() {
    effect(() => {
      console.log('INPUT PRODUCTOS', this.productos());
      this.updateChartData();
    });
  }

  ngAfterViewInit() {
    this.updateChartData();
  }

  private getEmptyChartConfig(): productsChart {
    return {
      series: [{ name: 'Inventario', data: [] }],
      chart: {
        type: 'bar' as ChartType,
        height: 300,
        width: '100%',
        toolbar: { show: false },
      },
      colors: ['#7a93daff'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '65%',
        },
      },
      dataLabels: { enabled: true },
      legend: { show: false },
      tooltip: {
        y: { formatter: (value: number) => `${value} unidades` },
      },
      xaxis: { categories: [] },
      stroke: { show: true, colors: ['#fff'], width: 2 },
    };
  }

  private updateChartData() {
    const data = this.productos();

    if (!data || data.length === 0) {
      console.log('No hay datos de productos');
      this.chartConfig = this.getEmptyChartConfig();
      this.updateChart();
      return;
    }

    const categorias: Record<string, number> = {};

    data.forEach((producto) => {
      const categoria = producto.categoria_info?.categoria || 'Sin categoría';
      const cantidad = Number(producto.cantidad || 0);
      categorias[categoria] = (categorias[categoria] || 0) + cantidad;
    });

    const sorted = Object.entries(categorias).sort((a, b) => b[1] - a[1]);

    this.chartConfig = {
      ...this.chartConfig,
      series: [{ name: 'Inventario', data: sorted.map((x) => x[1]) }],
      xaxis: { categories: sorted.map((x) => x[0]) },
    };
    this.updateChart();
  }

  private updateChart() {
    if (this.chart) {
      // Actualizar series y categorías del eje X
      this.chart.updateSeries(this.chartConfig.series);
      this.chart.updateOptions({
        xaxis: { categories: this.chartConfig.xaxis.categories },
      });
    }
  }
}
