import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SSHService } from './ssh.service';

describe('Service Tests', () => {
  describe('SSH Service', () => {
    let service: SSHService;
    let httpMock: HttpTestingController;
    let expectedResult: string | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      expectedResult = null;
      service = TestBed.inject(SSHService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should get SSH public key', () => {
        const publicKey = 'myPublicKey';
        service.getSshPublicKey().subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(publicKey);
        expect(expectedResult).toEqual(publicKey);
      });
    });
  });
});
