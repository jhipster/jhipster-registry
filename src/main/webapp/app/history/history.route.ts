import {Route, Routes} from '@angular/router';

import {UserRouteAccessService} from '../shared';
import {JhiHistoryComponent} from './history.component';

export const historyState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'History'
    },
    canActivate: [UserRouteAccessService],
    children: [{
        path: 'history',
        component: JhiHistoryComponent,
        data: {
            pageTitle: 'History'
        },
        canActivate: [UserRouteAccessService],
    }]
}
];
