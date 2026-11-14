import { Routes } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

const routes: Routes = [
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs'),
    title: 'API',
  },
  {
    path: 'configuration',
    loadComponent: () => import('./configuration/configuration'),
    title: 'Configuration',
  },
  {
    path: 'health',
    loadComponent: () => import('./health/health'),
    title: 'Health Checks',
  },
  {
    path: 'logs',
    loadComponent: () => import('./logs/logs'),
    title: 'Logs',
  },
  {
    path: 'metrics',
    loadComponent: () => import('./metrics/metrics'),
    title: 'Application Metrics',
  },
  // jhipster-needle-add-admin-route - JHipster will add admin routes here
];

export default routes;
