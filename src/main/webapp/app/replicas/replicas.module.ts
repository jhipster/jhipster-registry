import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from '../shared';

import {
    REPLICAS_ROUTE,
    JhiReplicasComponent,
    JhiReplicasService
} from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedModule,
        RouterModule.forRoot([REPLICAS_ROUTE], {useHash: true})
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
