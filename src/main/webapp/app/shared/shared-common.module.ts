import { NgModule, Sanitizer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'ng-jhipster';
import { GroupByPipe } from './pipe/group-by.pipe';
import {
    JHipsterRegistrySharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiRouteSelectorComponent,
    JhiRefreshSelectorComponent
} from './';

export function alertServiceProvider(sanitizer: Sanitizer) {
    // set below to true to make alerts look like toast
    const isToast = false;
    return new AlertService(sanitizer, isToast);
}

@NgModule({
    imports: [
        JHipsterRegistrySharedLibsModule
    ],
    declarations: [
        JhiAlertComponent,
        JhiAlertErrorComponent,
        JhiRouteSelectorComponent,
        JhiRefreshSelectorComponent,
        GroupByPipe
    ],
    providers: [
        {
            provide: AlertService,
            useFactory: alertServiceProvider,
            deps: [Sanitizer]
        },
        Title
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
export class JHipsterRegistrySharedCommonModule {}
