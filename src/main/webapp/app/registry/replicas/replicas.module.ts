import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { replicasRoute } from './replicas.route';
import { ReplicasComponent } from './replicas.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([replicasRoute])],
  declarations: [ReplicasComponent],
})
export class ReplicasModule {}
