import { Component, OnDestroy, OnInit } from '@angular/core';
import { Application, ApplicationsService, Instance, InstanceStatus } from './applications.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  activeApplication?: Application | null;
  applications?: Array<Application>;
  instances?: Array<Instance>;
  orderProp: string;
  private unsubscribe$ = new Subject();

  constructor(private applicationsService: ApplicationsService, private refreshService: RefreshService) {
    this.orderProp = 'name';
  }

  ngOnInit(): void {
    this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh(): void {
    this.applicationsService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(applications => {
        this.applications = applications;
        if (this.activeApplication) {
          this.selectActiveApplication(this.activeApplication.name);
        } else if (applications.length > 0) {
          this.selectActiveApplication(applications[0].name);
        }
      });
  }

  selectActiveApplication(applicationName: string): void {
    this.applications!.forEach(application => {
      application.active = '';
      if (application.name === applicationName) {
        this.activeApplication = application;
        this.instances = application.instances;
        application.active = 'active';
      }
    });
  }

  checkInstanceLength(instances: Array<Instance>): boolean {
    return this.countActiveInstances(instances) < instances.length;
  }

  displayCountInstances(instances: Array<Instance>): string {
    return `${String(this.countActiveInstances(instances))}/${String(instances.length)}`;
  }

  countActiveInstances(instances: Array<Instance>): number {
    return instances.filter(instance => instance.status === 'UP').length;
  }

  getBadgeClass(status: InstanceStatus): string {
    if (status === 'UP') {
      return 'bg-success';
    } else {
      return 'bg-danger';
    }
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
