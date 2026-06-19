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
    path: 'editar-paquete/:id?',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../../business/paquetes/nuevo-paquete/nuevo-paquete.component').then(
        (m) => m.NuevoPaqueteComponent,
      ),
    data: {
      title: 'Editar Paquete',
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
  // {
  //   path: 'empresas',
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () =>
  //         import('../../business/empresas/lista-empresas/lista-empresas.component').then(
  //           (m) => m.ListaEmpresasComponent,
  //         ),
  //       data: { title: 'Empresas' },
  //     },
  //     // Puedes agregar más rutas para crear/editar/ver empresas
  //   ],
  // },

  {
    path: 'empresas',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../business/empresas/lista-empresas/lista-empresas.component').then(
            (m) => m.ListaEmpresasComponent,
          ),
        data: { title: 'Empresas' },
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('../../business/empresas/nueva-empresa/nueva-empresa.component').then(
            (m) => m.NuevaEmpresaComponent,
          ),
        data: { title: 'Nueva Empresa' },
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('../../business/empresas/nueva-empresa/nueva-empresa.component').then(
            (m) => m.NuevaEmpresaComponent,
          ),
        data: { title: 'Editar Empresa' },
      },
      {
        path: 'ver/:id',
        loadComponent: () =>
          import('../../business/empresas/nueva-empresa/nueva-empresa.component').then(
            (m) => m.NuevaEmpresaComponent,
          ),
        data: { title: 'Ver Empresa' },
      },
    ],
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../business/usuarios/user/lista-usuarios/lista-usuarios.component').then(
            (m) => m.ListaUsuariosComponent,
          ),
        data: { title: 'Usuarios' },
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('../../business/usuarios/user/nuevo-usuario/nuevo-usuario.component').then(
            (m) => m.NuevoUsuarioComponent,
          ),
        data: { title: 'Nuevo Usuario' },
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('../../business/usuarios/user/nuevo-usuario/nuevo-usuario.component').then(
            (m) => m.NuevoUsuarioComponent,
          ),
        data: { title: 'Editar Usuario' },
      },
    ],
  },
  {
    path: 'admin-usuarios',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../business/usuarios/admin/admin_usuarios/admin-usuarios.component').then(
            (m) => m.AdminUsuariosComponent,
          ),
        data: { title: 'Usuarios' },
      },
      {
        path: 'admin-nuevo',
        loadComponent: () =>
          import('../../business/usuarios/admin/admin_nuevo_usuario/admin-nuevo-usuario.component').then(
            (m) => m.AdminNuevoUsuarioComponent,
          ),
        data: { title: 'Nuevo Usuario' },
      },
      {
        path: 'admin-editar/:id',
        loadComponent: () =>
          import('../../business/usuarios/admin/admin_nuevo_usuario/admin-nuevo-usuario.component').then(
            (m) => m.AdminNuevoUsuarioComponent,
          ),
        data: { title: 'Editar Usuario' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
