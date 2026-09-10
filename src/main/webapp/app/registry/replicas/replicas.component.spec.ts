import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { RefreshService } from 'app/shared/refresh/refresh.service';
import { ReplicasComponent } from './replicas.component';
import { ReplicasService } from './replicas.service';
import { EurekaStatusService } from 'app/home/eureka.status.service';

describe('Component Tests', () => {
  describe('ReplicasComponent', () => {
    let comp: ReplicasComponent;
    let fixture: ComponentFixture<ReplicasComponent>;
    let service: ReplicasService;
    let statusService: EurekaStatusService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, HttpClientTestingModule, NgbCollapseModule, NgxWebstorageModule.forRoot()],
        declarations: [ReplicasComponent],
        providers: [ReplicasService, RefreshService, EurekaStatusService],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ReplicasComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ReplicasService);
      statusService = TestBed.inject(EurekaStatusService);
      jest.spyOn(statusService, 'findAll').mockReturnValue(of({ status: {} }));
      jest.spyOn(service, 'findAll').mockReturnValue(of([]));
      fixture.detectChanges();
    });

    it.each(['consul', 'kubernetes'])('explains unavailable replicas for %s and hides Netflix configuration instructions', backend => {
      jest.spyOn(statusService, 'findAll').mockReturnValue(of({ status: { backend } }));
      comp.showMore = false;

      comp.refresh();
      fixture.detectChanges();

      const text = (fixture.nativeElement as HTMLElement).textContent!;
      expect(text).toContain(backend === 'consul' ? 'Consul' : 'Kubernetes');
      expect(text).toContain('does not expose Eureka peer replicas');
      expect(text).not.toContain('Configuring replication');
      expect(text).not.toContain('Spring Cloud Netflix');
    });

    it.each([undefined, 'eureka'])('retains replicas and instructions for legacy or explicit Eureka status (%s)', backend => {
      jest.spyOn(statusService, 'findAll').mockReturnValue(of({ status: { backend } }));
      jest.spyOn(service, 'findAll').mockReturnValue(of(['localhost:8761']));
      comp.showMore = false;

      comp.refresh();
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('#replicas a')?.getAttribute('href')).toBe('http://localhost:8761');
      expect(element.textContent).toContain('Configuring replication');
      expect(element.textContent).not.toContain('does not expose Eureka peer replicas');
    });

    it('refresh data', () => {
      const response: string[] = ['localhost:8761'];
      jest.spyOn(service, 'findAll').mockReturnValue(of(response));

      comp.refresh();

      expect(service.findAll).toHaveBeenCalled();
      expect(comp.replicas).toEqual(response);
    });
  });
});
