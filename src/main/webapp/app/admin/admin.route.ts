import { Routes } from '@angular/router';

import {
    configurationRoute,
    healthRoute,
    logfileRoute,
    logsRoute,
    metricsRoute
} from './';

import { UserRouteAccessService } from '../shared';

const ADMIN_ROUTES = [
    configurationRoute,
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
