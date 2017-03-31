import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {JhipsterRegistrySharedModule} from '../shared';

import {
    adminState,
    JhiHealthCheckComponent,
    JhiHealthModalComponent,
    JhiHealthService,
    JhiMetricsMonitoringComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsService
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
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent
    ],
    entryComponents: [
        JhiHealthModalComponent,
        JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        // JhiConfigurationService,
        JhiHealthService,
        JhiMetricsService,
        // LogsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryAdminModule {}
