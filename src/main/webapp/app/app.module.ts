import './vendor.ts';

import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageService, SessionStorageService, NgxWebstorageModule } from 'ngx-webstorage';
import { JhiEventManager } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { JHipsterRegistrySharedModule, UserRouteAccessService } from './shared';
import { JHipsterRegistryAppRoutingModule } from './app-routing.module';
import { JHipsterRegistryHomeModule } from 'app/home';
import { JHipsterRegistryAdminModule } from './admin/admin.module';
import { JHipsterRegistryModule } from './registry/registry.module';

import { PaginationConfig } from './blocks/config/uib-pagination.config';

import { JhiMainComponent, NavbarComponent, FooterComponent, ProfileService, PageRibbonComponent, ErrorComponent } from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        JHipsterRegistryAppRoutingModule,
        NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
        JHipsterRegistrySharedModule.forRoot(),
        JHipsterRegistryHomeModule,
        JHipsterRegistryAdminModule,
        JHipsterRegistryModule
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
    providers: [
        ProfileService,
        PaginationConfig,
        UserRouteAccessService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [LocalStorageService, SessionStorageService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [Injector]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [JhiEventManager]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [Injector]
        }
    ],
    bootstrap: [JhiMainComponent]
})
export class JHipsterRegistryAppModule {}
