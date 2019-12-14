/* tslint:disable:no-access-missing-member */
// TODO lint disabled as the filter pipe used in template seems to trigger this
import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiApplicationsService } from './applications.service';
import { JhiRefreshService } from 'app/shared/refresh/refresh.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['applications.component.scss']
})
export class JhiApplicationsComponent implements OnInit, OnDestroy {
  application: any;
  data: any;
  instances: any;
  activeInstance: any;
  orderProp: string;
  private unsubscribe$ = new Subject();

  constructor(private applicationsService: JhiApplicationsService, private refreshService: JhiRefreshService) {
    this.orderProp = 'name';
  }

  ngOnInit() {
    this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh() {
    this.applicationsService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.data = data;
        if (this.application) {
          this.show(this.application);
        } else if (data.applications.length > 0) {
          this.show(data.applications[0].name);
        }
      });
  }

  show(app) {
    this.application = app;
    let found = false;
    for (const dataApp of this.data.applications) {
      dataApp.active = '';
      if (dataApp.name === this.application) {
        this.instances = dataApp.instances;
        dataApp.active = 'active';
        found = true;
      }
    }
    if (!found) {
      this.application = false;
    }
  }

  countInstances(app) {
    let count = 0;
    for (const instance of app) {
      if (instance.status === 'UP') {
        count++;
      }
    }
    return count;
  }

  checkInstanceLength(app) {
    return this.countInstances(app) < app.length;
  }

  displayCountInstances(app) {
    return this.countInstances(app) + '/' + app.length;
  }

  getBadgeClass(statusState) {
    if (statusState && statusState === 'UP') {
      return 'badge-success';
    } else {
      return 'badge-danger';
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
