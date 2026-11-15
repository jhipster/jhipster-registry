import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { Subscription, interval } from 'rxjs';

import { RefreshService } from './refresh.service';

@Component({
  selector: 'jhi-refresh-selector',
  templateUrl: './refresh-selector.html',
  styleUrl: './refresh-selector.scss',
  imports: [FontAwesomeModule, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle],
})
export default class RefreshSelector implements OnInit {
  readonly refreshTimes = [0, 5, 10, 30, 60, 300];
  readonly activeRefreshTime = signal(0);

  private refreshTimer?: Subscription;
  private readonly destroyRef = inject(DestroyRef);
  private readonly refreshService = inject(RefreshService);

  ngOnInit(): void {
    this.activeRefreshTime.set(this.refreshService.getSelectedRefreshTime());
    this.refreshService.refreshChanged$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.launchTimer());
    this.launchTimer();
  }

  manualRefresh(): void {
    this.refreshService.refreshReload();
  }

  /** Change the active time only if it is a known one, otherwise disable the timer. */
  setActiveRefreshTime(time: number): void {
    this.activeRefreshTime.set(this.refreshTimes.includes(time) ? time : 0);
    this.refreshService.storeSelectedRefreshTime(this.activeRefreshTime());
    this.refreshService.refreshChanged();
  }

  getActiveRefreshTime(): string {
    return this.activeRefreshTime() <= 0 ? 'disabled' : `${this.activeRefreshTime()} sec.`;
  }

  /** Launch (or relaunch) the timer. */
  private launchTimer(): void {
    this.refreshTimer?.unsubscribe();
    if (this.activeRefreshTime() > 0) {
      this.refreshTimer = interval(this.activeRefreshTime() * 1000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.refreshService.refreshReload());
    }
  }
}
