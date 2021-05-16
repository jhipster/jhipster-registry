import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { RefreshService } from 'app/shared/refresh/refresh.service';
import { ReplicasComponent } from './replicas.component';
import { ReplicasService } from './replicas.service';

describe('Component Tests', () => {
  describe('ReplicasComponent', () => {
    let comp: ReplicasComponent;
    let fixture: ComponentFixture<ReplicasComponent>;
    let service: ReplicasService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
          declarations: [ReplicasComponent],
          providers: [ReplicasService, RefreshService],
        })
          .overrideTemplate(ReplicasComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(ReplicasComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ReplicasService);
      fixture.detectChanges();
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
