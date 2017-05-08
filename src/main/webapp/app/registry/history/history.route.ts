import { Route } from '@angular/router';

import { JhiHistoryComponent } from './history.component';

export const historyRoute: Route = {
    path: 'history',
    component: JhiHistoryComponent,
    data: {
        pageTitle: 'History'
    }
};
