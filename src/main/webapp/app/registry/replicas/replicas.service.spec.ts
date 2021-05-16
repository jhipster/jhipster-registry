import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ReplicasService } from './replicas.service';

describe('Service Tests', () => {
  describe('Replicas Service', () => {
    let service: ReplicasService;
    let httpMock: HttpTestingController;
    let expectedResult: string[] | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      expectedResult = null;
      service = TestBed.inject(ReplicasService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should find all replicas', () => {
        const replicas: string[] = ['localhost:8761'];
        service.findAll().subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(replicas);
        expect(expectedResult).toEqual(replicas);
      });
    });
  });
});
