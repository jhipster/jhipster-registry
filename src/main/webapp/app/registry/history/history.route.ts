import { Route } from '@angular/router';
import { HistoryComponent } from './history.component';

export const historyRoute: Route = {
  path: '',
  component: HistoryComponent,
  data: {
    pageTitle: 'History',
  },
};
