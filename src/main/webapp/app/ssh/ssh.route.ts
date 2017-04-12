import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { JhiSSHComponent } from './ssh.component';

export const SSH_ROUTE: Route = {
    path: 'ssh',
    component: JhiSSHComponent,
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService]
};
