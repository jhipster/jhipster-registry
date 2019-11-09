import { Route } from '@angular/router';
import { JhiHistoryComponent } from './history.component';

export const historyRoute: Route = {
  path: '',
  component: JhiHistoryComponent,
  data: {
    pageTitle: 'History'
  }
};
