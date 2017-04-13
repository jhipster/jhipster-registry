import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {JhipsterRegistrySharedModule} from '../shared';

import {
    replicasState,
    JhiReplicasComponent,
    JhiReplicasService
} from './';

@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot(replicasState, {useHash: true})
    ],
    declarations: [
        JhiReplicasComponent
    ],
    entryComponents: [],
    providers: [
        JhiReplicasService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryReplicasModule {}
