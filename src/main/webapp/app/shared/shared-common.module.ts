import { NgModule, Sanitizer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'ng-jhipster';
import {
    JHipsterRegistrySharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiRouteSelectorComponent
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
        JhiRouteSelectorComponent
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
        JhiRouteSelectorComponent
    ]
})
export class JHipsterRegistrySharedCommonModule {}
