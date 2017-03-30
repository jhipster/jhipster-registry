import "./vendor.ts";

import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {Ng2Webstorage} from "ng2-webstorage";

import {JhipsterRegistrySharedModule, UserRouteAccessService} from "./shared";
import {JHipsterRegistryHomeModule} from "./home";
import {JHipsterRegistryApplicationsModule} from "./applications";
import {JHipsterRegistryRoutesModule} from "./routes";
import {JHipsterRegistryHistoryModule} from "./history";
import {JHipsterRegistryReplicasModule} from "./replicas";
import {JHipsterRegistryConfigModule} from "./config";
import {JHipsterRegistrySSHModule} from "./ssh";
import {JHipsterRegistryAdminModule} from "./admin/admin.module";

import {
    ErrorComponent,
    FooterComponent,
    JhiMainComponent,
    LayoutRoutingModule,
    NavbarComponent,
    PageRibbonComponent,
    ProfileService
} from "./layouts";
import {customHttpProvider} from "./blocks/interceptor/http.provider";
import {PaginationConfig} from "./blocks/config/uib-pagination.config";


@NgModule({
    imports: [
        RouterModule,
        BrowserModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        JhipsterRegistrySharedModule,
        JHipsterRegistryHomeModule,
        JHipsterRegistryApplicationsModule,
        JHipsterRegistryRoutesModule,
        JHipsterRegistryHistoryModule,
        JHipsterRegistryReplicasModule,
        JHipsterRegistryConfigModule,
        JHipsterRegistrySSHModule,
        JHipsterRegistryAdminModule
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
        { provide: Window, useValue: window },
        { provide: Document, useValue: document },
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class JHipsterRegistryAppModule {}
