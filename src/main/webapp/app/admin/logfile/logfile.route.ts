import { Route } from '@angular/router';

import { JhiLogfileComponent } from './logfile.component';

export const logfileRoute: Route = {
  path: '',
  component: JhiLogfileComponent,
  data: {
    pageTitle: 'Logs'
  }
};
