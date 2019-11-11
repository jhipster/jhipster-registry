import { NgModule } from '@angular/core';
import { JHipsterRegistrySharedLibsModule } from './shared-libs.module';
import { JhiAlertComponent } from './alert/alert.component';
import { JhiAlertErrorComponent } from './alert/alert-error.component';
import { JhiLoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { JhiRouteSelectorComponent } from 'app/shared/routes/route-selector.component';
import { JhiRefreshSelectorComponent } from 'app/shared/refresh/refresh-selector.component';
import { GroupByPipe } from 'app/shared/pipe/group-by.pipe';

@NgModule({
  imports: [JHipsterRegistrySharedLibsModule],
  declarations: [
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLoginModalComponent,
    HasAnyAuthorityDirective,
    JhiRouteSelectorComponent,
    JhiRefreshSelectorComponent,
    GroupByPipe
  ],
  entryComponents: [JhiLoginModalComponent],
  exports: [
    JHipsterRegistrySharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLoginModalComponent,
    HasAnyAuthorityDirective,
    JhiRouteSelectorComponent,
    JhiRefreshSelectorComponent
  ]
})
export class JHipsterRegistrySharedModule {}
