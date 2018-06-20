import { Route } from '@angular/router';
import { JhiConfigComponent } from './config.component';

export const configRoute: Route = {
    path: 'config',
    component: JhiConfigComponent,
    data: {
        pageTitle: 'Configuration'
    }
};
