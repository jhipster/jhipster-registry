import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParseLinks } from 'ng-jhipster';

import { JhipsterRegistrySharedModule } from '../shared';

import {
    adminState,
    // LogsComponent,
    // JhiMetricsMonitoringModalComponent,
    // JhiMetricsMonitoringComponent,
    JhiHealthModalComponent,
    JhiHealthCheckComponent,
    // JhiConfigurationComponent,
    // JhiConfigurationService,
    JhiHealthService,
    // JhiMetricsService,
    // LogsService
} from './';


@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot(adminState, { useHash: true })
    ],
    declarations: [
        // LogsComponent,
        // JhiConfigurationComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        // JhiMetricsMonitoringComponent,
        // JhiMetricsMonitoringModalComponent
    ],
    entryComponents: [
        JhiHealthModalComponent,
        // JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        // JhiConfigurationService,
        JhiHealthService,
        // JhiMetricsService,
        // LogsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryAdminModule {}
