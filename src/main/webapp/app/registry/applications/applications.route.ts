import { Route } from '@angular/router';

import { JhiApplicationsComponent } from './applications.component';

export const applicationsRoute: Route = {
    path: 'applications',
    component: JhiApplicationsComponent,
    data: {
        pageTitle: 'Applications'
    }
};
