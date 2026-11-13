import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap/nav';

import { ProfileService } from 'app/layouts/profiles/profile.service';
import { ApplicationsService } from 'app/registry/applications/applications.service';
import RefreshSelector from 'app/shared/refresh/refresh-selector';
import { RefreshService } from 'app/shared/refresh/refresh.service';

import { ConfigService } from './config.service';

@Component({
  selector: 'jhi-config',
  templateUrl: './config.html',
  imports: [FormsModule, JsonPipe, KeyValuePipe, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet, RefreshSelector],
})
export default class Config implements OnInit {
  application = 'application';
  profile = 'prod';
  label = 'main';

  readonly isNative = signal(true);
  readonly configurationSources = signal<Record<string, unknown>[]>([]);
  readonly configAsYaml = signal('');
  readonly configAsProperties = signal('');
  readonly configAsJson = signal('');
  readonly configAsKeyValuePairs = signal<Map<string, string> | undefined>(undefined);
  readonly applications = signal(['application']);

  private readonly defaultLabel = 'main';
  private readonly destroyRef = inject(DestroyRef);
  private readonly configService = inject(ConfigService);
  private readonly profileService = inject(ProfileService);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly refreshService = inject(RefreshService);

  ngOnInit(): void {
    this.load();
    this.refresh();
  }

  load(): void {
    this.profileService
      .getProfileInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(profileInfo => this.isNative.set(profileInfo.activeProfiles?.includes('native') ?? false));

    this.configService
      .getConfigSources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.label = response.label ?? this.defaultLabel;
        this.configurationSources.set(response.serverConfigurationSources ?? []);
      });

    this.refreshService.refreshReload$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refresh());
  }

  refresh(): void {
    this.configService
      .getConfigAsYaml(this.application, this.profile, this.label)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.configAsYaml.set(response),
        error: () => this.configAsYaml.set(''),
      });

    this.configService
      .getConfigAsProperties(this.application, this.profile, this.label)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.configAsProperties.set(response);
          const keyValuePairs = new Map<string, string>();
          response.split('\n').forEach(property => {
            const [key, value] = property.split(': ');
            keyValuePairs.set(key, value);
          });
          this.configAsKeyValuePairs.set(keyValuePairs);
        },
        error: () => this.configAsProperties.set(''),
      });

    this.configService
      .getConfigAsJson(this.application, this.profile, this.label)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.configAsJson.set(response),
        error: () => this.configAsJson.set(''),
      });

    this.applicationsService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(applications => {
        const names = ['application'];
        applications.forEach(application => {
          const instanceId = application.instances[0]?.instanceId ?? '';
          names.push(instanceId.includes(':') ? instanceId.substring(0, instanceId.indexOf(':')) : application.name.toLowerCase());
        });
        this.applications.set(names);
      });
  }

  getKeys(obj: Record<string, unknown>): string[] {
    return Object.keys(obj);
  }
}
