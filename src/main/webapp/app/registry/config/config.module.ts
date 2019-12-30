import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { configRoute } from './config.route';
import { ConfigComponent } from './config.component';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([configRoute])],
  declarations: [ConfigComponent]
})
export class ConfigModule {}
