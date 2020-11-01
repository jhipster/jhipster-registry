import { Route } from '@angular/router';

import { ApplicationsComponent } from './applications.component';

export const applicationsRoute: Route = {
  path: '',
  component: ApplicationsComponent,
  data: {
    pageTitle: 'Applications',
  },
};
