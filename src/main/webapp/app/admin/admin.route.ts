<<<<<<< HEAD
import { Routes } from '@angular/router';

import {
    configurationRoute,
    healthRoute,
    logsRoute,
    metricsRoute
=======
import { Routes, CanActivate } from '@angular/router';

import {
    // configurationRoute,
    healthRoute,
    // logsRoute,
    // metricsRoute
>>>>>>> refs/remotes/origin/angular-2
} from './';

import { UserRouteAccessService } from '../shared';

let ADMIN_ROUTES = [
<<<<<<< HEAD
    configurationRoute,
    healthRoute,
    logsRoute,
    metricsRoute
=======
    // configurationRoute,
    healthRoute,
    // logsRoute,
    // metricsRoute
>>>>>>> refs/remotes/origin/angular-2
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
