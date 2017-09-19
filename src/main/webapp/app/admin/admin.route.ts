import { Routes } from '@angular/router';

import {
    configurationRoute,
    docsRoute,
    healthRoute,
    logfileRoute,
    logsRoute,
    metricsRoute
} from './';

import { UserRouteAccessService } from '../shared';

const ADMIN_ROUTES = [
    configurationRoute,
    docsRoute,
    healthRoute,
    logfileRoute,
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
}];
