import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EurekaHistory, HistoryService } from './history.service';

describe('Service Tests', () => {
  describe('History Service', () => {
    let service: HistoryService;
    let httpMock: HttpTestingController;
    let expectedResult: EurekaHistory | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      expectedResult = null;
      service = TestBed.inject(HistoryService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should get all histories', () => {
        const response = {
          canceled: {
            '11052017': 'instance1',
          },
          registered: {
            '11022017': 'instance2',
          },
        };
        service.findAll().subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(response);
        expect(expectedResult).toEqual(response);
      });
    });
  });
});
