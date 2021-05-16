import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { sshRoute } from './ssh.route';
import { SSHComponent } from './ssh.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([sshRoute])],
  declarations: [SSHComponent],
})
export class SSHModule {}
