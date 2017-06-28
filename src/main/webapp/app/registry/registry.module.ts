import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from '../shared';

import {
    registryState,
    JhiApplicationsComponent,
    JhiConfigComponent,
    JhiEncryptionComponent,
    JhiHistoryComponent,
    JhiReplicasComponent,
    JhiSSHComponent,
    JhiApplicationsService,
    JhiConfigService,
    JhiEncryptionService,
    JhiHistoryService,
    JhiReplicasService,
    JhiSSHService
} from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedModule,
        RouterModule.forRoot(registryState, {useHash: true})
    ],
    declarations: [
        JhiApplicationsComponent,
        JhiConfigComponent,
        JhiEncryptionComponent,
        JhiHistoryComponent,
        JhiReplicasComponent,
        JhiSSHComponent
    ],
    entryComponents: [],
    providers: [
        JhiApplicationsService,
        JhiConfigService,
        JhiEncryptionService,
        JhiHistoryService,
        JhiReplicasService,
        JhiSSHService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryModule {}
