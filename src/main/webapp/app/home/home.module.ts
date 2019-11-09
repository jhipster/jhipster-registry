import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { HomeComponent } from './home.component';
import { HOME_ROUTE } from './home.route';
import { EurekaStatusService } from './eureka.status.service';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forRoot([HOME_ROUTE])],
  declarations: [HomeComponent],
  providers: [EurekaStatusService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryHomeModule {}
