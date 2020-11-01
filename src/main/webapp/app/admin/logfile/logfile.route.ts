import { Route } from '@angular/router';

import { LogfileComponent } from './logfile.component';

export const logfileRoute: Route = {
  path: '',
  component: LogfileComponent,
  data: {
    pageTitle: 'Logs',
  },
};
