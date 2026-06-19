import { NavItem } from '../models/NavItem.models';

// Este archivo se importa en sidebar-data.ts dentro de UI
export const NavMenuItems: NavItem[] = [
  // {
  //   displayName: 'Prueba',
  //   iconName: 'layout-dashboard',
  //   bgcolor: 'primary',
  //   route: '/business/prueba',
  //   ddType: '1',
  // },
  {
    displayName: 'Administrador',
    iconName: 'shield',
    route: '',
    ddType: '1',
    children: [
      {
        displayName: 'Empresas',
        iconName: 'chevron-right',
        route: '/business/empresas',
      },
      {
        displayName: 'Usuarios',
        iconName: 'chevron-right',
        route: '/business/admin-usuarios',
      },
    ],
  },
  {
    displayName: 'Usuarios',
    iconName: 'users',
    bgcolor: 'primary',
    route: '/business/usuarios',
    ddType: '1',
  },
  {
    displayName: 'Clientes',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/business/clientes',
    ddType: '1',
  },
  {
    displayName: 'Productos',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/business/productos',
    ddType: '1',
  },
  {
    displayName: 'Inventario',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/business/inventario',
    ddType: '1',
  },
  {
    displayName: 'Paquetes',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/business/paquetes',
    ddType: '1',
  },
  {
    displayName: 'Cotizaciones',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/business/cotizaciones',
    ddType: '1',
  },
  {
    displayName: 'Ajustes',
    iconName: 'settings',
    route: '',
    ddType: '1',
    children: [
      {
        displayName: 'Catálogos',
        iconName: 'chevron-right',
        route: '/business/catalogos',
      },
      {
        displayName: 'Categorías de productos',
        iconName: 'chevron-right',
        route: '/business/categoria-productos',
      },
    ],
  },
];
