import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { configRoute } from './config.route';
import { JhiConfigComponent } from './config.component';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([configRoute])],
  declarations: [JhiConfigComponent]
})
export class ConfigModule {}
