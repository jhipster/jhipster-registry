import { NgModule } from '@angular/core';
import { JHipsterRegistrySharedLibsModule } from './shared-libs.module';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { RouteSelectorComponent } from 'app/shared/routes/route-selector.component';
import { RefreshSelectorComponent } from 'app/shared/refresh/refresh-selector.component';
import { GroupByPipe } from 'app/shared/pipe/group-by.pipe';

@NgModule({
  imports: [JHipsterRegistrySharedLibsModule],
  declarations: [
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    RouteSelectorComponent,
    RefreshSelectorComponent,
    GroupByPipe,
  ],
  entryComponents: [LoginModalComponent],
  exports: [
    JHipsterRegistrySharedLibsModule,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    RouteSelectorComponent,
    RefreshSelectorComponent,
  ],
})
export class JHipsterRegistrySharedModule {}
