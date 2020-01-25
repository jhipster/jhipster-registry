import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { historyRoute } from './history.route';
import { HistoryComponent } from './history.component';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([historyRoute])],
  declarations: [HistoryComponent]
})
export class HistoryModule {}
