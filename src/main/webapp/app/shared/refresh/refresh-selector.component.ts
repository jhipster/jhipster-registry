import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RefreshService } from './refresh.service';

@Component({
  selector: 'jhi-refresh-selector',
  templateUrl: './refresh-selector.component.html',
  styleUrls: ['./refresh-selector.component.scss'],
})
export class RefreshSelectorComponent implements OnInit, OnDestroy {
  activeRefreshTime: number;
  refreshTimes: number[];
  refreshTimer?: Subscription;

  unSubscribe$ = new Subject();

  constructor(private refreshService: RefreshService) {
    this.refreshTimes = [0, 5, 10, 30, 60, 300];
    this.activeRefreshTime = this.refreshTimes[0];
  }

  ngOnInit(): void {
    this.activeRefreshTime = this.refreshService.getSelectedRefreshTime();
    this.refreshService.refreshChanged$.pipe(takeUntil(this.unSubscribe$)).subscribe(() => this.launchTimer(true));
    this.launchTimer(false);
  }

  ngOnDestroy(): void {
    /** prevent memory leak when component destroyed **/
    this.unSubscribe$.next(null);
    this.unSubscribe$.complete();
  }

  manualRefresh(): void {
    this.refreshService.refreshReload();
  }

  /** Change active time only if exists, else 0 **/
  setActiveRefreshTime(time: number): void {
    if (time && this.refreshTimes.findIndex(t => t === time) !== -1) {
      this.activeRefreshTime = time;
    } else {
      this.activeRefreshTime = this.refreshTimes[0];
    }
    this.refreshService.storeSelectedRefreshTime(time);
    this.refreshService.refreshChanged();
  }

  /** Init the timer **/
  subscribe(): void {
    if (this.activeRefreshTime && this.activeRefreshTime > 0) {
      this.refreshTimer = interval(this.activeRefreshTime * 1000)
        .pipe(takeUntil(this.unSubscribe$))
        .subscribe(() => {
          this.refreshService.refreshReload();
        });
    }
  }

  /** Launch (or relaunch if true) the timer. **/
  launchTimer(relaunch: boolean): void {
    if (relaunch && this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
    this.subscribe();
  }

  /* ==========================================================================
                                      UI PART
   ========================================================================== */

  classTime(): string | string[] | Set<string> | { [klass: string]: any } {
    if (this.activeRefreshTime <= 0) {
      return 'fa fa-pause';
    }
    return 'fa fa-repeat';
  }

  stateTime(time: number): string | string[] | Set<string> | { [klass: string]: any } {
    if (time === this.activeRefreshTime) {
      return 'active';
    }
    return '';
  }

  getActiveRefreshTime(): string {
    if (this.activeRefreshTime <= 0) {
      return 'disabled';
    }
    return `${String(this.activeRefreshTime)} sec.`;
  }
}
