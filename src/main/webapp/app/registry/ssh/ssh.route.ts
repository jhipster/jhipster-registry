import { Route } from '@angular/router';

import { JhiSSHComponent } from './ssh.component';

export const sshRoute: Route = {
    path: 'ssh',
    component: JhiSSHComponent,
    data: {
        pageTitle: 'SSH public key'
    }
};
