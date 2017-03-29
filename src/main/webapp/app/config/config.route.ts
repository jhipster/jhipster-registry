import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { JhiConfigComponent } from './config.component';

export const CONFIG_ROUTE: Route = {
    path: 'config',
    component: JhiConfigComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'Configuration'
    },
    canActivate: [UserRouteAccessService]
};
