import { Route } from '@angular/router';
import { ReplicasComponent } from './replicas.component';

export const replicasRoute: Route = {
  path: '',
  component: ReplicasComponent,
  data: {
    pageTitle: 'Replicas',
  },
};
