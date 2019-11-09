import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { JhiLogfileComponent } from 'app/admin/logfile/logfile.component';
import { logfileRoute } from 'app/admin/logfile/logfile.route';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([logfileRoute])],
  declarations: [JhiLogfileComponent]
})
export class LogfileModule {}
