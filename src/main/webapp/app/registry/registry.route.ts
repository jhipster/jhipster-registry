import { Routes } from '@angular/router';

import { applicationsRoute, configRoute, encryptionRoute, historyRoute, replicasRoute, sshRoute } from './';

import { UserRouteAccessService } from '../shared';

const REGISTRY_ROUTES = [
    applicationsRoute,
    configRoute,
    encryptionRoute,
    historyRoute,
    replicasRoute,
    sshRoute
];

export const registryState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: REGISTRY_ROUTES
}];
