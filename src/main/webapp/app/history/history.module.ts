import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from '../shared';

import {
    HISTORY_ROUTE,
    JhiHistoryComponent,
    JhiHistoryService
} from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedModule,
        RouterModule.forRoot([HISTORY_ROUTE], {useHash: true})
    ],
    declarations: [
        JhiHistoryComponent
    ],
    entryComponents: [],
    providers: [
        JhiHistoryService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryHistoryModule {
}
