import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import {
    JHipsterRegistrySharedLibsModule,
    JHipsterRegistrySharedCommonModule,
    CSRFService,
    AuthService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    Principal,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent,
    JhiRouteSelectorComponent,
    JhiRoutesService
} from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedLibsModule,
        JHipsterRegistrySharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        JhiRouteSelectorComponent
    ],
    providers: [
        JhiRoutesService,
        CookieService,
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        AuthService,
        UserService,
        DatePipe
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        JHipsterRegistrySharedCommonModule,
        JhiLoginModalComponent,
        JhiRouteSelectorComponent,
        HasAnyAuthorityDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class JHipsterRegistrySharedModule {}
