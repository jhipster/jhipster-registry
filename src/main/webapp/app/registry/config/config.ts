import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap/nav';

import { ProfileService } from 'app/layouts/profiles/profile.service';
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

  private readonly defaultLabel = 'main';
  private readonly destroyRef = inject(DestroyRef);
  private readonly configService = inject(ConfigService);
  private readonly profileService = inject(ProfileService);
  private readonly refreshService = inject(RefreshService);

  ngOnInit(): void {
    this.profileService
      .getProfileInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(profileInfo => this.isNative.set(profileInfo.activeProfiles?.includes('native') ?? false));

    // The configuration is fetched once the label of the config server is known, or could not be determined
    this.configService
      .getConfigSources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.label = response.label ?? this.defaultLabel;
          this.configurationSources.set(response.serverConfigurationSources ?? []);
          this.refresh();
        },
        error: () => this.refresh(),
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
          this.configAsKeyValuePairs.set(parseProperties(response));
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
  }

  getKeys(obj: Record<string, unknown>): string[] {
    return Object.keys(obj);
  }
}

/**
 * Parses the "key: value" lines the config server answers for a .properties request.
 * A value may itself contain ": ", and blank lines are skipped.
 */
export function parseProperties(properties: string): Map<string, string> {
  const keyValuePairs = new Map<string, string>();
  for (const line of properties.split('\n')) {
    const separator = line.indexOf(': ');
    if (separator > 0) {
      keyValuePairs.set(line.substring(0, separator), line.substring(separator + 2));
    } else if (line.trim() !== '') {
      keyValuePairs.set(line.trim().replace(/:$/, ''), '');
    }
  }
  return keyValuePairs;
}
