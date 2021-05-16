import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { encryptionRoute } from './encryption.route';
import { EncryptionComponent } from './encryption.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([encryptionRoute])],
  declarations: [EncryptionComponent],
})
export class EncryptionModule {}
