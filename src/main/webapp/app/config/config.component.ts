import { Component, OnInit } from '@angular/core';
import { JhiConfigService } from './config.service';
import { ProfileService } from '../layouts/profiles/profile.service';
import { JhiApplicationsService } from '../applications';

@Component({
    selector: 'jhi-config',
    templateUrl: './config.component.html',
})
export class JhiConfigComponent implements OnInit {
    application: string;
    profile: string;
    label: string;
    activeRegistryProfiles: any;
    isNative: boolean;

    data: any;
    applicationList: any;

    constructor(private configService: JhiConfigService,
                private profileService: ProfileService,
                private applicationsService: JhiApplicationsService) {
        this.application = 'application';
        this.profile = 'prod';
        this.label = 'master';
        this.activeRegistryProfiles = [];
        this.isNative = true;
    }

    ngOnInit() {
        this.load();
        this.refresh();
    }

    load() {
        this.profileService.getProfileInfo().subscribe((response) => {
            this.activeRegistryProfiles = response.activeProfiles;
            this.isNative = this.activeRegistryProfiles.includes('native');
            this['nativeSearchLocation'] = response['nativeSearchLocation'];
            this['gitUri'] = response['gitUri'];
            this['gitSearchLocation'] = response['gitSearchLocation'];
        });
    }

    refresh() {
        this.configService.getConfig(this.application, this.profile, this.label).subscribe((response) => {
            this.data = response;
        }, () => {
            this.data = '';
        });

        this.applicationsService.findAll().toPromise().then((data) => {
            this.applicationList = ['application'];
            data.applications.forEach(function(application) {
                const instanceId = application.instances[0].instanceId;
                let applicationName;
                if (instanceId.indexOf(':') === -1) {
                    applicationName = application.name.toLowerCase();
                } else {
                    applicationName = instanceId.substr(0, instanceId.indexOf(':'));
                }
                this.applicationList.push(applicationName);
            });
        });
    }
}
