import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'applications',
    loadComponent: () => import('./applications/applications'),
    title: 'Applications',
  },
  {
    path: 'config',
    loadComponent: () => import('./config/config'),
    title: 'Configuration',
  },
  {
    path: 'encryption',
    loadComponent: () => import('./encryption/encryption'),
    title: 'Encryption',
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history'),
    title: 'History',
  },
  {
    path: 'replicas',
    loadComponent: () => import('./replicas/replicas'),
    title: 'Replicas',
  },
  {
    path: 'ssh',
    loadComponent: () => import('./ssh/ssh'),
    title: 'SSH',
  },
];

export default routes;
