import {Route} from '@angular/router';

import {UserRouteAccessService} from '../shared';
import {JhiApplicationsComponent} from './applications.component';

export const APPLICATIONS_ROUTE: Route = {
    path: 'jhi-applications',
    component: JhiApplicationsComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'Applications'
    },
    canActivate: [UserRouteAccessService]
};
