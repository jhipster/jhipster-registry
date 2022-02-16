import { Route } from '@angular/router';
import { EncryptionComponent } from './encryption.component';

export const encryptionRoute: Route = {
  path: '',
  component: EncryptionComponent,
  data: {
    pageTitle: 'Encryption',
  },
};
