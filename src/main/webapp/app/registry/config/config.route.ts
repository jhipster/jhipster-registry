import { Route } from '@angular/router';
import { ConfigComponent } from './config.component';

export const configRoute: Route = {
  path: '',
  component: ConfigComponent,
  data: {
    pageTitle: 'Configuration',
  },
};
