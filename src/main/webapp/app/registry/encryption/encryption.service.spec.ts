import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EncryptionService } from './encryption.service';

describe('Service Tests', () => {
  describe('Encryption Service', () => {
    let service: EncryptionService;
    let httpMock: HttpTestingController;
    let expectedResult: string | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      expectedResult = null;
      service = TestBed.inject(EncryptionService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should encrypt text', () => {
        const textToEncrypt = 'my-text-to-encrypt';
        service.encrypt(textToEncrypt).subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush('8664f5cf85bf4350946a10516c0596e3b03fc28ef32589b7c928d3fbb3b48a532531cfb9c430b0411bc72c4894dca2cd');
        expect(expectedResult).toEqual(
          '{cipher}8664f5cf85bf4350946a10516c0596e3b03fc28ef32589b7c928d3fbb3b48a532531cfb9c430b0411bc72c4894dca2cd'
        );
      });

      it('should decrypt text', () => {
        const textToDecrypt = '9c896ddce1c558a3afa58adf236dfde5f3d22575925d800caecfde7bdb3192fdc877c79007dddb75466b8510b27fa87d';
        service.decrypt(textToDecrypt).subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush('my-text-to-decrypt');
        expect(expectedResult).toEqual('my-text-to-decrypt');
      });
    });
  });
});
