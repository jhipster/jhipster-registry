import { Route } from '@angular/router';

import { JhiLogfileComponent } from './logfile.component';

export const logfileRoute: Route = {
    path: 'logs',
    component: JhiLogfileComponent,
    data: {
        pageTitle: 'Logs'
    }
};
