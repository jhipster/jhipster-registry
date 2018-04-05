import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from 'app/shared';

import {
    adminState,
    LogsComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsMonitoringComponent,
    JhiHealthModalComponent,
    JhiHealthCheckComponent,
    JhiConfigurationComponent,
    JhiDocsComponent,
    JhiConfigurationService,
    JhiLogfileComponent,
    JhiHealthService,
    JhiMetricsService,
    LogsService,
    JhiLogfileService
} from './';

@NgModule({
    imports: [JHipsterRegistrySharedModule, RouterModule.forChild(adminState)],
    declarations: [
        LogsComponent,
        JhiConfigurationComponent,
        JhiDocsComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent,
        JhiLogfileComponent
    ],
    entryComponents: [JhiHealthModalComponent, JhiMetricsMonitoringModalComponent],
    providers: [JhiConfigurationService, JhiHealthService, JhiMetricsService, LogsService, JhiLogfileService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryAdminModule {}
