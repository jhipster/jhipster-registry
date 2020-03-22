import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { HealthCheckComponent } from './health.component';
import { HealthModalComponent } from './health-modal.component';

import { healthRoute } from './health.route';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([healthRoute])],
  declarations: [HealthCheckComponent, HealthModalComponent],
  entryComponents: [HealthModalComponent]
})
export class HealthModule {}
