import { Route } from '@angular/router';
import { JhiReplicasComponent } from './replicas.component';

export const replicasRoute: Route = {
    path: 'replicas',
    component: JhiReplicasComponent,
    data: {
        pageTitle: 'Replicas'
    }
};
