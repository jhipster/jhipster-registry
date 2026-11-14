import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { KeysPipe } from 'app/shared/array/keys.pipe';
import { OrderByPipe } from 'app/shared/array/order-by.pipe';
import RefreshSelector from 'app/shared/refresh/refresh-selector';
import { RefreshService } from 'app/shared/refresh/refresh.service';

import { Application, ApplicationsService, Instance, InstanceStatus } from './applications.service';

@Component({
  selector: 'jhi-applications',
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
  imports: [FontAwesomeModule, KeysPipe, OrderByPipe, RefreshSelector],
})
export default class Applications implements OnInit {
  readonly applications = signal<Application[] | undefined>(undefined);
  readonly activeApplicationName = signal<string | undefined>(undefined);
  readonly instances = computed(
    () => this.applications()?.find(application => application.name === this.activeApplicationName())?.instances,
  );
  readonly orderProp = 'name';

  private readonly destroyRef = inject(DestroyRef);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly refreshService = inject(RefreshService);

  ngOnInit(): void {
    this.refreshService.refreshReload$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh(): void {
    this.applicationsService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(applications => {
        this.applications.set(applications);
        // select the first application when none is selected, or when the selected one is no longer registered
        if (applications.length > 0 && !applications.some(application => application.name === this.activeApplicationName())) {
          this.selectActiveApplication(applications[0].name);
        }
      });
  }

  selectActiveApplication(applicationName: string): void {
    this.activeApplicationName.set(applicationName);
  }

  checkInstanceLength(instances: Instance[]): boolean {
    return this.countActiveInstances(instances) < instances.length;
  }

  displayCountInstances(instances: Instance[]): string {
    return `${this.countActiveInstances(instances)}/${instances.length}`;
  }

  countActiveInstances(instances: Instance[]): number {
    return instances.filter(instance => instance.status === 'UP').length;
  }

  getBadgeClass(status?: InstanceStatus): string {
    return status === 'UP' ? 'bg-success' : 'bg-danger';
  }
}
