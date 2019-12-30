import { Route } from '@angular/router';

import { MetricsMonitoringComponent } from './metrics.component';

export const metricsRoute: Route = {
  path: '',
  component: MetricsMonitoringComponent,
  data: {
    pageTitle: 'Application Metrics'
  }
};
