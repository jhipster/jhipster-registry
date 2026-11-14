import { Routes } from '@angular/router';

export const errorRoute: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./error'),
    title: 'Error page!',
  },
  {
    path: 'accessdenied',
    loadComponent: () => import('./error'),
    data: {
      errorMessage: 'You are not authorized to access this page.',
    },
    title: 'Error page!',
  },
  {
    path: '404',
    loadComponent: () => import('./error'),
    data: {
      errorMessage: 'The page does not exist.',
    },
    title: 'Error page!',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
