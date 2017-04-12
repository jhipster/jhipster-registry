import { Route, Routes } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { JhiSSHComponent } from './ssh.component';

export const sshState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: [{
        path: 'ssh',
        component: JhiSSHComponent,
        data: {
            pageTitle: 'SSH public key'
        },
        canActivate: [UserRouteAccessService]
    }]
}
];
