import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { RefreshService } from 'app/shared/refresh/refresh.service';

import Applications from './applications';
import { Application, ApplicationsService } from './applications.service';

describe('Applications Component', () => {
  let comp: Applications;
  let fixture: ComponentFixture<Applications>;
  let service: ApplicationsService;

  const applications: Application[] = [
    {
      name: 'app1',
      instances: [
        { instanceId: 'app1:1', status: 'UP' },
        { instanceId: 'app1:2', status: 'DOWN' },
      ],
    },
    { name: 'app2', instances: [{ instanceId: 'app2:1', status: 'UP' }] },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    fixture = TestBed.createComponent(Applications);
    comp = fixture.componentInstance;
    service = TestBed.inject(ApplicationsService);
    vi.spyOn(service, 'findAll').mockReturnValue(of(applications));
  });

  it('should load applications and select the first one on init', () => {
    comp.ngOnInit();

    expect(comp.applications()).toEqual(applications);
    expect(comp.activeApplicationName()).toBe('app1');
    expect(comp.instances()).toEqual(applications[0].instances);
  });

  it('should keep the selected application after a refresh', () => {
    comp.ngOnInit();
    comp.selectActiveApplication('app2');

    TestBed.inject(RefreshService).refreshReload();

    expect(service.findAll).toHaveBeenCalledTimes(2);
    expect(comp.instances()).toEqual(applications[1].instances);
  });

  it('should select another application when the selected one is no longer registered', () => {
    comp.ngOnInit();
    comp.selectActiveApplication('app1');
    vi.spyOn(service, 'findAll').mockReturnValue(of([applications[1]]));

    TestBed.inject(RefreshService).refreshReload();

    expect(comp.activeApplicationName()).toBe('app2');
    expect(comp.instances()).toEqual(applications[1].instances);
  });

  it('should count the instances that are up', () => {
    expect(comp.countActiveInstances(applications[0].instances)).toBe(1);
    expect(comp.displayCountInstances(applications[0].instances)).toBe('1/2');
    expect(comp.checkInstanceLength(applications[0].instances)).toBe(true);
    expect(comp.checkInstanceLength(applications[1].instances)).toBe(false);
  });

  it('should return a success badge only for UP', () => {
    expect(comp.getBadgeClass('UP')).toBe('bg-success');
    expect(comp.getBadgeClass('DOWN')).toBe('bg-danger');
  });
});
