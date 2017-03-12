import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterRegistrySharedModule } from '../shared';

import {
    HISTORY_ROUTE,
    JhiHistoryComponent,
    JhiHistoryService
} from './';


@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot([ HISTORY_ROUTE ], {useHash: true})
    ],
    declarations: [
        JhiHistoryComponent
    ],
    entryComponents: [],
    providers: [
        JhiHistoryService
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class JHipsterRegistryHistoryModule {
}
