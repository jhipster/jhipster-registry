import { Route } from '@angular/router';
import { SSHComponent } from './ssh.component';

export const sshRoute: Route = {
  path: '',
  component: SSHComponent,
  data: {
    pageTitle: 'SSH public key',
  },
};
