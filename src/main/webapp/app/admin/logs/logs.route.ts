import { Route } from '@angular/router';

import { LogsComponent } from './logs.component';

export const logsRoute: Route = {
    path: 'loggers',
    component: LogsComponent,
    data: {
        pageTitle: 'Loggers'
    }
};
