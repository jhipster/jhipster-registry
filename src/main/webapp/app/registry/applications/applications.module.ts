import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationsComponent } from './applications.component';
import { applicationsRoute } from './applications.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([applicationsRoute])],
  declarations: [ApplicationsComponent],
})
export class ApplicationsModule {}
