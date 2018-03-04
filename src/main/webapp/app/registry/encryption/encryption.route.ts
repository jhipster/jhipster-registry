import { Route } from '@angular/router';
import { JhiEncryptionComponent } from './encryption.component';

export const encryptionRoute: Route = {
    path: 'encryption',
    component: JhiEncryptionComponent,
    data: {
        pageTitle: 'Encryption'
    }
};
