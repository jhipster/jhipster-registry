import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiConfigService } from './config.service';
import { ProfileService } from '../../layouts/profiles/profile.service';
import { JhiApplicationsService } from '../';
import { JhiRefreshService } from '../../shared/refresh/refresh.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-config',
    templateUrl: './config.component.html'
})
export class JhiConfigComponent implements OnInit, OnDestroy {
    application: string;
    profile: string;
    label: string;
    activeRegistryProfiles: any;
    isNative: boolean;
    nativeSearchLocation: string;
    gitUri: string;
    gitSearchLocation: string;
    data: any;
    applicationList: Array<string>;

    refreshReloadSubscription: Subscription;

    constructor(private configService: JhiConfigService,
                private profileService: ProfileService,
                private applicationsService: JhiApplicationsService,
                private refreshService: JhiRefreshService
    ) {
        this.application = 'application';
        this.profile = 'prod';
        this.label = 'master';
        this.activeRegistryProfiles = [];
        this.isNative = true;
        this.applicationList = ['application'];
    }

    ngOnInit() {
        this.load();
        this.refresh();
    }

    ngOnDestroy() {
        this.refreshReloadSubscription.unsubscribe();
    }

    load() {
        this.profileService.getProfileInfo().subscribe((response) => {
            this.activeRegistryProfiles = response.activeProfiles;
            this.isNative = this.activeRegistryProfiles.includes('native');
            this.nativeSearchLocation = response.nativeSearchLocation;
            this.gitUri = response.gitUri;
            this.gitSearchLocation = response.gitSearchLocation;
        });

        this.refreshReloadSubscription = this.refreshService.refreshReload$.subscribe((empty) => this.refresh());
    }

    refresh() {
        this.configService.getConfig(this.application, this.profile, this.label).subscribe((response) => {
            this.data = response;
        }, () => {
            this.data = '';
        });

        this.applicationsService.findAll().subscribe((data) => {
            if (data && data.applications) {
                this.applicationList = ['application'];
                data.applications.forEach((application) => {
                    const instanceId = application.instances[0].instanceId;
                    let applicationName;
                    if (instanceId.indexOf(':') === -1) {
                        applicationName = application.name.toLowerCase();
                    } else {
                        applicationName = instanceId.substr(0, instanceId.indexOf(':'));
                    }
                    this.applicationList.push(applicationName);
                });
            }
        });
    }
}
