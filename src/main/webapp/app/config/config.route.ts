import { Route, Routes } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { JhiConfigComponent } from './config.component';


export const configState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'History'
    },
    canActivate: [UserRouteAccessService],
    children: [{
        path: 'config',
        component: JhiConfigComponent,
        data: {
            pageTitle: 'Configuration'
        },
        canActivate: [UserRouteAccessService],
    }]
}
];
