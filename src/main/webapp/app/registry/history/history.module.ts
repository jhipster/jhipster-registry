import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { historyRoute } from './history.route';
import { HistoryComponent } from './history.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([historyRoute])],
  declarations: [HistoryComponent],
})
export class HistoryModule {}
