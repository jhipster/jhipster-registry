import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Application, ApplicationsService, DiscoveryResponse } from './applications.service';

describe('Service Tests', () => {
  describe('Applications Service', () => {
    let service: ApplicationsService;
    let httpMock: HttpTestingController;
    let expectedResult: Application[] | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      expectedResult = null;
      service = TestBed.inject(ApplicationsService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should find all applications', () => {
        const applications: Application = {
          name: 'app1',
          instances: [
            {
              instanceId: 1,
              status: 'UP',
              homePageUrl: 'home',
            },
          ],
        };
        const discoveryResponse: DiscoveryResponse = {
          backend: 'eureka',
          applications: [applications],
        };
        service.findAll().subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne('api/discovery/applications');
        expect(req.request.method).toBe('GET');
        req.flush(discoveryResponse);
        expect(expectedResult).toEqual([applications]);
      });
    });
  });
});
