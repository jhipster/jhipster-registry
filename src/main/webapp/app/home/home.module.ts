import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { EurekaStatusService } from 'app/home/eureka.status.service';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
  providers: [EurekaStatusService]
})
export class JHipsterRegistryHomeModule {}
