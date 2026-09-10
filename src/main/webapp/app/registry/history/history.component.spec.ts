import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { RefreshService } from 'app/shared/refresh/refresh.service';
import { HistoryComponent } from 'app/registry/history/history.component';
import { HistoryService } from 'app/registry/history/history.service';
import { EurekaStatusService } from 'app/home/eureka.status.service';
import { KeysPipe } from 'app/shared/array/keys.pipe';
import { OrderByPipe } from 'app/shared/array/order-by.pipe';

describe('Component Tests', () => {
  describe('HistoryComponent', () => {
    let comp: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let service: HistoryService;
    let statusService: EurekaStatusService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, HttpClientTestingModule, NgbNavModule, NgxWebstorageModule.forRoot()],
        declarations: [HistoryComponent, KeysPipe, OrderByPipe],
        providers: [HistoryService, RefreshService, EurekaStatusService],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HistoryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HistoryService);
      statusService = TestBed.inject(EurekaStatusService);
      jest.spyOn(statusService, 'findAll').mockReturnValue(of({ status: {} }));
      jest.spyOn(service, 'findAll').mockReturnValue(of({ registered: {}, canceled: {} }));
      fixture.detectChanges();
    });

    it.each(['consul', 'kubernetes'])('explains unavailable lease history for %s without showing Eureka tabs', backend => {
      jest.spyOn(statusService, 'findAll').mockReturnValue(of({ status: { backend } }));

      comp.refresh();
      fixture.detectChanges();

      const text = (fixture.nativeElement as HTMLElement).textContent!;
      expect(text).toContain(backend === 'consul' ? 'Consul' : 'Kubernetes');
      expect(text).toContain('does not expose Eureka lease history');
      expect(text).not.toContain('Last registered leases');
      expect(text).not.toContain('Last canceled leases');
    });

    it.each([undefined, 'eureka'])('retains lease history for legacy or explicit Eureka status (%s)', backend => {
      jest.spyOn(statusService, 'findAll').mockReturnValue(of({ status: { backend } }));
      jest.spyOn(service, 'findAll').mockReturnValue(of({ registered: { '1700000000000': 'order-instance' }, canceled: {} }));

      comp.refresh();
      fixture.detectChanges();

      const text = (fixture.nativeElement as HTMLElement).textContent!;
      expect(text).toContain('Last registered leases');
      expect(text).toContain('order-instance');
      expect(text).not.toContain('does not expose Eureka lease history');
    });

    it('refresh data', fakeAsync((): void => {
      const response = {
        canceled: {
          '11052017': 'instance1',
        },
        registered: {
          '11022017': 'instance2',
        },
      };
      jest.spyOn(service, 'findAll').mockReturnValue(of(response));

      comp.refresh();
      tick();

      expect(service.findAll).toHaveBeenCalled();
      expect(comp.eurekaHistory).toEqual(response);
    }));

    it('activate registered tab', fakeAsync((): void => {
      const response = {
        canceled: {
          '11052017': 'instance1',
        },
        registered: {
          '11022017': 'instance2',
        },
      };
      jest.spyOn(service, 'findAll').mockReturnValue(of(response));

      comp.ngOnInit();
      tick();
      comp.activate('registered');

      expect(comp.histories![11022017]).toEqual('instance2');
    }));
  });
});
