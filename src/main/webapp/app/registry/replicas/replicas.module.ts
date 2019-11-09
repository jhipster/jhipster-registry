import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { replicasRoute } from './replicas.route';
import { JhiReplicasComponent } from './replicas.component';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([replicasRoute])],
  declarations: [JhiReplicasComponent]
})
export class ReplicasModule {}
