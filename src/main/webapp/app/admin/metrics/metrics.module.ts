import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { MetricsMonitoringComponent } from './metrics.component';

import { metricsRoute } from './metrics.route';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([metricsRoute])],
  declarations: [MetricsMonitoringComponent]
})
export class MetricsModule {}
