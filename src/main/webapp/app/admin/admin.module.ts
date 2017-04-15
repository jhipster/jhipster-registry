import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from '../shared';

import {
    adminState,
    JhiConfigurationComponent,
    JhiConfigurationService,
    JhiHealthCheckComponent,
    JhiHealthModalComponent,
    JhiHealthService,
    LogsComponent,
    LogsService,
    JhiMetricsMonitoringComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsService
} from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedModule,
        RouterModule.forRoot(adminState, { useHash: true })
    ],
    declarations: [
        LogsComponent,
        JhiConfigurationComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent
    ],
    entryComponents: [
        JhiHealthModalComponent,
        JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        JhiConfigurationService,
        JhiHealthService,
        JhiMetricsService,
        LogsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryAdminModule {}
