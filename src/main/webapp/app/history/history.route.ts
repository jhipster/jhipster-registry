import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { JhiHistoryComponent } from './history.component';

export const HISTORY_ROUTE: Route = {
    path: 'history',
    component: JhiHistoryComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'History'
    },
    canActivate: [UserRouteAccessService]
};
