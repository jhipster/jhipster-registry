import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiConfigService } from './config.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { JhiApplicationsService } from '../';
import { JhiRefreshService } from 'app/shared/refresh/refresh.service';
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
    configurationSources: Array<any>;
    configAsYaml: any;
    configAsProperties: any;
    configAsJson: any;
    configAsKeyValuePairs: any;
    applicationList: Array<string>;

    refreshReloadSubscription: Subscription;

    constructor(
        private configService: JhiConfigService,
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
        this.profileService.getProfileInfo().then(response => {
            this.activeRegistryProfiles = response.activeProfiles;
            this.isNative = this.activeRegistryProfiles.includes('native');
            this.configurationSources = response.configurationSources;
        });

        this.refreshReloadSubscription = this.refreshService.refreshReload$.subscribe(empty => this.refresh());
    }

    refresh() {
        this.configService.getConfigAsYaml(this.application, this.profile, this.label).subscribe(response => {
                this.configAsYaml = response;
            },
            () => {
                this.configAsYaml = '';
            }
        );

        this.configService.getConfigAsProperties(this.application, this.profile, this.label).subscribe(response => {
                this.configAsProperties = response;

                const keyValueArray = [];
                this.configAsProperties.split('\n').forEach(property => {
                    const keyValueSplit = property.split(': ');
                    keyValueArray.push({ key: keyValueSplit[0], value: keyValueSplit[1] });
                });
                this.configAsKeyValuePairs = keyValueArray;
            },
            () => {
                this.configAsProperties = '';
            }
        );

        this.configService.getConfigAsJson(this.application, this.profile, this.label).subscribe(response => {
                this.configAsJson = response;
            },
            () => {
                this.configAsJson = {};
            }
        );

        this.applicationsService.findAll().subscribe(data => {
            if (data && data.applications) {
                this.applicationList = ['application'];
                data.applications.forEach(application => {
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

    getKeys(obj: Object) {
        return Object.keys(obj);
    }
}
