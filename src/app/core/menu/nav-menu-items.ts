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
        iconName: 'point',
        route: '/business/catalogos',
      },
      {
        displayName: 'Categorías de productos',
        iconName: 'point',
        route: '/business/categoria-productos',
      },
    ],
  },
  // {
  //   displayName: 'Productos',
  //   iconName: 'point',
  //   route: '',
  //   ddType: '1',
  //   children: [
  //     {
  //       displayName: 'Lista de productos',
  //       iconName: 'point',
  //       route: '/business/productos',
  //     },
  //     {
  //       displayName: 'Categorías',
  //       iconName: 'point',
  //       route: '/business/categoria-productos',
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Paquetes',
  //   iconName: 'layout-dashboard',
  //   bgcolor: 'primary',
  //   route: '',
  //   ddType: '1',
  //   children: [
  //     {
  //       displayName: 'Lista de paquetes',
  //       iconName: 'point',
  //       route: '/business/paquetes',
  //     },
  //     {
  //       displayName: 'Nuevo paquete',
  //       iconName: 'point',
  //       route: '/business/nuevo-paquete',
  //     },
  //   ],
  // },
];
