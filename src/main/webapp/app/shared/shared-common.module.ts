import { NgModule, LOCALE_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GroupByPipe } from './pipe/group-by.pipe';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/en';
import {
    JHipsterRegistrySharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiRouteSelectorComponent,
    JhiRefreshSelectorComponent
} from './';

@NgModule({
    imports: [JHipsterRegistrySharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent, JhiRouteSelectorComponent, JhiRefreshSelectorComponent, GroupByPipe],
    providers: [
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        }
    ],
    exports: [
        JHipsterRegistrySharedLibsModule,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        JhiRouteSelectorComponent,
        JhiRefreshSelectorComponent,
        GroupByPipe
    ]
})
export class JHipsterRegistrySharedCommonModule {
    constructor() {
        registerLocaleData(locale);
    }
}
