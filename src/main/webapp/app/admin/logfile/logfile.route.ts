import { Route } from '@angular/router';

import { JhiLogfileComponent } from './logfile.component';

export const logfileRoute: Route = {
    path: 'jhi-logfile',
    component: JhiLogfileComponent,
    data: {
        pageTitle: 'Logfile'
    }
};
