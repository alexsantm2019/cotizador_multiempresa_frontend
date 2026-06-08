import { Routes } from '@angular/router';
// import { PruebaComponent } from '../../business/prueba/prueba.component';
// import { ClientsComponent } from '../../business/clients/clients.component';
import { AuthGuard } from '../guard/auth.guard';

export const GpsRoutes: Routes = [
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
  // {
  //   path: 'clients',
  //   canActivate: [AuthGuard],
  //   // component: ClientsComponent,
  //   loadComponent: () =>
  //     import('../../business/clients/clients.component').then(
  //       (m) => m.ClientsComponent
  //     ),
  //   data: {
  //     title: 'Clients',
  //   },
  // },
  {
    path: '**',
    redirectTo: 'auth-gps/login',
  },
];
