import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { configRoute } from './config.route';
import { ConfigComponent } from './config.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([configRoute])],
  declarations: [ConfigComponent],
})
export class ConfigModule {}
