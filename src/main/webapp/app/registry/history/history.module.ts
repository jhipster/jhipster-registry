import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { historyRoute } from './history.route';
import { JhiHistoryComponent } from './history.component';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([historyRoute])],
  declarations: [JhiHistoryComponent]
})
export class HistoryModule {}
