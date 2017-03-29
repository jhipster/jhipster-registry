import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { JhiReplicasComponent } from './replicas.component';

export const REPLICAS_ROUTE: Route = {
    path: 'replicas',
    component: JhiReplicasComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'Replicas'
    },
    canActivate: [UserRouteAccessService]
};
