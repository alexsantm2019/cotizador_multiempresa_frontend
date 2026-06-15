import { Routes } from '@angular/router';
// import { PruebaComponent } from '../../business/prueba/prueba.component';
// import { ClientsComponent } from '../../business/clients/clients.component';
import { ListaClientesComponent } from '../../business/clientes/lista-clientes/lista-clientes.component';
import { AuthGuard } from '../guard/auth.guard';

export const MainRoutes: Routes = [
  // {
  //   path: 'prueba',
  //   canActivate: [AuthGuard],
  //   // component: PruebaComponent,
  //   loadComponent: () =>
  //     import('../../business/prueba/prueba.component').then(
  //       (m) => m.PruebaComponent
  //     ),
  //   data: {
  //     title: 'Prueba',
  //   },
  // },
  {
    path: 'clientes',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/clientes/lista-clientes/lista-clientes.component').then(
        (m) => m.ListaClientesComponent,
      ),
    data: {
      title: 'Clientes',
    },
  },
  {
    path: 'catalogos',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/catalogos/catalogos.component').then(
        (m) => m.CatalogosComponent,
      ),
    data: {
      title: 'Catalogos',
    },
  },
  {
    path: 'productos',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/productos/lista-productos/lista-productos.component').then(
        (m) => m.ListaProductosComponent,
      ),
    data: {
      title: 'Productos',
    },
  },
  {
    path: 'categoria-productos',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/categoria_productos/categoria-parent/categoria-parent.component').then(
        (m) => m.CategoriaParentComponent,
      ),
    data: {
      title: 'Categoría productos',
    },
  },
  {
    path: 'inventario',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/inventario/inventario.component').then(
        (m) => m.InventarioComponent,
      ),
    data: {
      title: 'Categoría productos',
    },
  },
  {
    path: 'paquetes',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/paquetes/lista-paquetes/lista-paquetes.component').then(
        (m) => m.ListaPaquetesComponent,
      ),
    data: {
      title: 'Categoría productos',
    },
  },
  {
    path: 'nuevo-paquete',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/paquetes/nuevo-paquete/nuevo-paquete.component').then(
        (m) => m.NuevoPaqueteComponent,
      ),
    data: {
      title: 'Nuevo paquete',
    },
  },
  {
    path: 'cotizaciones',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/cotizaciones/cotizaciones-parent/cotizaciones-parent.component').then(
        (m) => m.CotizacionesParentComponent,
      ),
    data: {
      title: 'Cotizaciones',
    },
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    // component: ClientsComponent,
    loadComponent: () =>
      import('../../business/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    data: {
      title: 'Dashboard Cotizador',
    },
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
