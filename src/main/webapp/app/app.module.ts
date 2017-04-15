import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { JHipsterRegistrySharedModule, UserRouteAccessService } from './shared';
import { JHipsterRegistryHomeModule } from './home';
import { JHipsterRegistryApplicationsModule } from './applications';
import { JHipsterRegistryRoutesModule } from './routes';
import { JHipsterRegistryHistoryModule } from './history';
import { JHipsterRegistryReplicasModule } from './replicas';
import { JHipsterRegistryConfigModule } from './config';
import { JHipsterRegistrySSHModule } from './ssh';
import { JHipsterRegistryAdminModule } from './admin/admin.module';

import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';

import {
    JhiMainComponent,
    LayoutRoutingModule,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ErrorComponent
} from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        JHipsterRegistrySharedModule,
        JHipsterRegistryHomeModule,
        JHipsterRegistryAdminModule,
        JHipsterRegistryApplicationsModule,
        JHipsterRegistryRoutesModule,
        JHipsterRegistryHistoryModule,
        JHipsterRegistryReplicasModule,
        JHipsterRegistryConfigModule,
        JHipsterRegistrySSHModule
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent
    ],
    providers: [
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class JHipsterRegistryAppModule {}
