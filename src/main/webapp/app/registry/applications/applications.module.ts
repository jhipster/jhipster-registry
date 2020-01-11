import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';
import { JhiApplicationsComponent } from './applications.component';
import { applicationsRoute } from './applications.route';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([applicationsRoute])],
  declarations: [JhiApplicationsComponent]
})
export class ApplicationsModule {}
