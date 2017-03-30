import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";

import {JhipsterRegistrySharedModule} from "../shared";

import {JhiRoutesService} from "./";

@NgModule({
    imports: [
        JhipsterRegistrySharedModule
    ],
    entryComponents: [],
    providers: [
        JhiRoutesService
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class JHipsterRegistryRoutesModule {}
