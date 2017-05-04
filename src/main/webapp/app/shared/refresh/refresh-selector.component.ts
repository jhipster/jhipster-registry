import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Observable } from 'rxjs/Observable';
import { JhiRefreshService } from './refresh.service';

@Component({
    selector: 'jhi-refresh-selector',
    templateUrl: './refresh-selector.component.html',
    styleUrls: [
        'refresh-selector.component.scss'
    ]
})
export class JhiRefreshSelectorComponent implements OnInit, OnDestroy {

    activeRefreshTime: number;
    refreshTimes: number[];
    refreshTimer: Subscription;
    refreshChangedSubscription: Subscription;

    constructor(
        private refreshService: JhiRefreshService,
    ) {
        this.refreshTimes = [0, 5, 10, 30, 60, 300];
        this.activeRefreshTime = this.refreshTimes[0];
    }

    ngOnInit() {
        this.activeRefreshTime = this.refreshService.getSelectedRefreshTime();
        this.refreshChangedSubscription = this.refreshService.refreshChanged$.subscribe((empty) => this.launchTimer(true));
        this.launchTimer(false);
    }

    ngOnDestroy() {
        /** prevent memory leak when component destroyed **/
        this.refreshChangedSubscription.unsubscribe();
        if (this.refreshTimer) {
            this.refreshTimer.unsubscribe();
        }
    }

    manualRefresh() {
        this.refreshService.refreshReload();
    }

    /** Change active time only if exists, else 0 **/
    setActiveRefreshTime(time: number) {
        if (time && this.refreshTimes.findIndex((t) => t === time) !== -1) {
            this.activeRefreshTime = time;
        } else {
            this.activeRefreshTime = this.refreshTimes[0];
        }
        this.refreshService.storeSelectedRefreshTime(time);
        this.refreshService.refreshChanged();
    }

    /** Init the timer **/
    subscribe() {
        if (this.activeRefreshTime && this.activeRefreshTime > 0) {
            this.refreshTimer = Observable.interval(this.activeRefreshTime * 1000).subscribe(() => {
                this.refreshService.refreshReload();
            });
        }
    }

    /** Launch (or relaunch if true) the timer. **/
    launchTimer(relaunch: boolean) {
        if (relaunch && this.refreshTimer) {
            this.refreshTimer.unsubscribe();
        }
        this.subscribe();
    }

    /* ==========================================================================
                                        UI PART
     ========================================================================== */

    classTime(): string {
        if (this.activeRefreshTime <= 0) {
            return 'fa fa-pause';
        }
        return 'fa fa-repeat';
    }

    stateTime(time: number): string {
        if (time === this.activeRefreshTime) {
            return 'active';
        }
    }

    getActiveRefreshTime(): string {
        if (this.activeRefreshTime <= 0) {
            return 'disabled';
        }
        return this.activeRefreshTime + ' sec.';
    }

}
