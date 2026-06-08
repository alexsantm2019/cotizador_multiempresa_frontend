import { Component, ViewChild, inject } from '@angular/core';
import { ClientsService } from 'src/app/services/gps/clients/clients.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PAGINATION_TABLE_HTML_SNIPPET } from 'src/app/pages/tables/pagination-table/code/pagination-table-html-snippet';
import { PAGINATION_TABLE_TS_SNIPPET } from 'src/app/pages/tables/pagination-table/code/pagination-table-ts-snippet';
import { Highlight, HighlightAuto } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { BehaviorSubject, filter, take } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginator,
    MatPaginatorModule,
    // MatTableDataSource,
    MatTableModule,
    Highlight,
    HighlightAuto,
    HighlightLineNumbers,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  clients: any[] = [];
  private clientsService = inject(ClientsService);
  displayedColumns: string[] = ['id', 'nombre'];
  dataSource: any;
  codeForPaginationTable = PAGINATION_TABLE_HTML_SNIPPET;
  codeForPaginationTableTs = PAGINATION_TABLE_TS_SNIPPET;
  private dataLoaded = new BehaviorSubject<boolean>(false);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  ngOnInit(): void {
    this.getClients();
  }

  ngAfterViewInit(): void {
    this.dataLoaded
      .pipe(
        filter((loaded) => loaded),
        take(1)
      )
      .subscribe(() => {
        this.dataSource.paginator = this.paginator;
      });
  }

  getClients(): void {
    this.clientsService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.dataSource = new MatTableDataSource<Element>(this.clients);
        console.log('clients: ', this.clients);
        this.dataLoaded.next(true);
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }
}
