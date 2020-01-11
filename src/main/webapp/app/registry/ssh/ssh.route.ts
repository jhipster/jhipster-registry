import { Route } from '@angular/router';
import { JhiSSHComponent } from './ssh.component';

export const sshRoute: Route = {
  path: '',
  component: JhiSSHComponent,
  data: {
    pageTitle: 'SSH public key'
  }
};
