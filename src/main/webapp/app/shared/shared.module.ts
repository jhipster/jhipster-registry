import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie';

import {
    JHipsterRegistrySharedLibsModule,
    JHipsterRegistrySharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AuthUAAServerProvider,
    AuthSessionServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    LoginOAuth2Service,
    LoginUAAService,
    LoginUAAModalService,
    Principal,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent,
    JhiLoginUAAModalComponent,
    JhiRoutesService,
    JhiRefreshService
} from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedLibsModule,
        JHipsterRegistrySharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        JhiLoginUAAModalComponent,
        HasAnyAuthorityDirective
    ],
    providers: [
        JhiRoutesService,
        JhiRefreshService,
        AuthServerProvider,
        AuthSessionServerProvider,
        CookieService,
        LoginService,
        LoginModalService,
        LoginOAuth2Service,
        LoginUAAService,
        LoginUAAModalService,
        LoginUAAService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        AuthUAAServerProvider,
        UserService,
        DatePipe
    ],
    entryComponents: [JhiLoginModalComponent, JhiLoginUAAModalComponent],
    exports: [
        JHipsterRegistrySharedCommonModule,
        JhiLoginModalComponent,
        JhiLoginUAAModalComponent,
        HasAnyAuthorityDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistrySharedModule {}
