import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import {
    AccountService,
    AuthServerProvider,
    AuthService,
    CSRFService,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent,
    JwtSharedCommonModule,
    JwtSharedLibsModule,
    LoginModalService,
    LoginService,
    Principal,
    StateStorageService,
    UserService
 } from './';

@NgModule({
    imports: [
        JwtSharedLibsModule,
        JwtSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective
    ],
    providers: [
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
        JwtSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class JhipsterRegistrySharedModule {}
