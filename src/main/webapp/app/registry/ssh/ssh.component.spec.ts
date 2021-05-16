import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SSHComponent } from './ssh.component';
import { SSHService } from './ssh.service';

describe('Component Tests', () => {
  describe('SSHComponent', () => {
    let comp: SSHComponent;
    let fixture: ComponentFixture<SSHComponent>;
    let service: SSHService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [SSHComponent],
          providers: [SSHService],
        })
          .overrideTemplate(SSHComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(SSHComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SSHService);
    });

    describe('ngOnInit', () => {
      it('should get SSH public key on init', () => {
        const publicKey = 'myPublicKey';
        jest.spyOn(service, 'getSshPublicKey').mockReturnValue(of(publicKey));

        comp.ngOnInit();

        expect(service.getSshPublicKey).toHaveBeenCalled();
        expect(comp.data).toEqual(publicKey);
      });
    });
  });
});
