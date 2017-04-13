import {Route, Routes} from '@angular/router';

import {UserRouteAccessService} from '../shared';
import {JhiApplicationsComponent} from './applications.component';

export const applicationsState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: [{
        path: 'applications',
        component: JhiApplicationsComponent,
        data: {
            pageTitle: 'Applications'
        },
        canActivate: [UserRouteAccessService]
    }]
}
];
