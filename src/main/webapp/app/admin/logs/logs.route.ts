import {Route} from '@angular/router';
import {JhiLogsComponent} from './logs.component';

export const logsRoute: Route = {
  path: 'jhi-logs',
  component: JhiLogsComponent,
  data: {
    pageTitle: 'Logs'
  }
};
