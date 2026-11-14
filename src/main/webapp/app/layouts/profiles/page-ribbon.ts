import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, map, of } from 'rxjs';

import type { ProfileInfo } from './profile-info.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'jhi-page-ribbon',
  template: `
    @if (ribbonEnvSignal(); as ribbonEnv) {
      <div class="ribbon">
        <a href="">{{ { dev: 'Development' }[ribbonEnv ?? ''] }}</a>
      </div>
    }
  `,
  styleUrl: './page-ribbon.scss',
})
export default class PageRibbon {
  readonly ribbonEnvSignal = signal<string | undefined>(undefined);

  private readonly profileService = inject(ProfileService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.profileService
      .getProfileInfo()
      .pipe(
        map((profileInfo: ProfileInfo) => profileInfo.ribbonEnv),
        catchError(() => of(undefined)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(ribbonEnv => this.ribbonEnvSignal.set(ribbonEnv));
  }
}
