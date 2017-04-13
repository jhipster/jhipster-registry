import {Route, Routes} from '@angular/router';

import {UserRouteAccessService} from '../shared';
import {JhiReplicasComponent} from './replicas.component';

export const replicasState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: [{
        path: 'replicas',
        component: JhiReplicasComponent,
        data: {
            pageTitle: 'Replicas'
        },
        canActivate: [UserRouteAccessService]
    }]
}
];
