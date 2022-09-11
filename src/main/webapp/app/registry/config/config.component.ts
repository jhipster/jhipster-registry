import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { ApplicationsService } from 'app/registry/applications/applications.service';

@Component({
  selector: 'jhi-config',
  templateUrl: './config.component.html',
})
export class ConfigComponent implements OnInit, OnDestroy {
  application = 'application';
  profile = 'prod';
  defaultLabel = 'main';
  label = this.defaultLabel;
  activeRegistryProfiles?: string[] = [];
  isNative = true;
  configurationSources?: Array<any>;
  configAsYaml?: string;
  configAsProperties?: string;
  configAsJson?: string;
  configAsKeyValuePairs?: Map<string, string>;
  applications = ['application'];
  private unsubscribe$ = new Subject();

  constructor(
    private configService: ConfigService,
    private profileService: ProfileService,
    private applicationsService: ApplicationsService,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.load();
    this.refresh();
  }

  load(): void {
    this.profileService
      .getProfileInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.activeRegistryProfiles = response.activeProfiles;
        this.isNative = this.activeRegistryProfiles!.includes('native');
      });

    this.configService
      .getConfigSources()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.label = response.label ?? this.defaultLabel;
        this.configurationSources = response.serverConfigurationSources;
      });

    this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.refresh());
  }

  refresh(): void {
    this.configService
      .getConfigAsYaml(this.application, this.profile, this.label)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => (this.configAsYaml = response),
        error: () => (this.configAsYaml = ''),
      });

    this.configService
      .getConfigAsProperties(this.application, this.profile, this.label)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          this.configAsProperties = response;
          const keyValueArray: Map<string, string> = new Map();
          this.configAsProperties.split('\n').forEach(property => {
            const keyValueSplit: string[] = property.split(': ');
            keyValueArray.set(keyValueSplit[0], keyValueSplit[1]);
          });
          this.configAsKeyValuePairs = keyValueArray;
        },
        error: () => {
          this.configAsProperties = '';
        },
      });

    this.configService
      .getConfigAsJson(this.application, this.profile, this.label)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => (this.configAsJson = response),
        error: () => (this.configAsJson = ''),
      });

    this.applicationsService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(applications => {
        this.applications = ['application'];
        applications.forEach(application => {
          const instanceId = application.instances[0].instanceId;
          let applicationName;
          if (instanceId.indexOf(':') === -1) {
            applicationName = application.name.toLowerCase();
          } else {
            applicationName = instanceId.substr(0, instanceId.indexOf(':'));
          }
          this.applications.push(applicationName);
        });
      });
  }

  getKeys(obj: Record<string, unknown>): string[] {
    return Object.keys(obj);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
