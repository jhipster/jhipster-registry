import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JHipsterRegistrySharedModule } from 'app/shared/shared.module';

import { sshRoute } from './ssh.route';
import { JhiSSHComponent } from './ssh.component';

@NgModule({
  imports: [JHipsterRegistrySharedModule, RouterModule.forChild([sshRoute])],
  declarations: [JhiSSHComponent]
})
export class SSHModule {}
