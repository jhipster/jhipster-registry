import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LogsComponent } from './logs.component';

export const logsRoute: Route = {
  path: 'jhi-logs',
  component: LogsComponent,
  data: {
    pageTitle: 'Logs'
  }
};
