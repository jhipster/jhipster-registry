import { Routes, CanActivate } from '@angular/router';

import {
    configurationRoute,
    healthRoute,
    logsRoute,
    metricsRoute
} from './';

import { UserRouteAccessService } from '../shared';

let ADMIN_ROUTES = [
    configurationRoute,
    healthRoute,
    logsRoute,
    metricsRoute
];


export const adminState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: ADMIN_ROUTES
}
];