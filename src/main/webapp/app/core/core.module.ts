import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { Title } from '@angular/platform-browser';
import locale from '@angular/common/locales/en';

import {
    LoginService,
    LoginModalService,
    AccountService,
    StateStorageService,
    Principal,
    CSRFService,
    AuthServerProvider,
    UserService,
    UserRouteAccessService
} from './';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        LoginService,
        LoginModalService,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        UserService,
        DatePipe,
        UserRouteAccessService
    ]
})
export class JhipsterCoreModule {
    constructor() {
        registerLocaleData(locale);
    }
}
