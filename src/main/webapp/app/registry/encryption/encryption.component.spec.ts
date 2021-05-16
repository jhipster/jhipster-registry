import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { EncryptionService } from './encryption.service';
import { EncryptionComponent } from './encryption.component';

describe('Component Tests', () => {
  describe('EncryptionComponent', () => {
    let comp: EncryptionComponent;
    let fixture: ComponentFixture<EncryptionComponent>;
    let service: EncryptionService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [EncryptionComponent],
          providers: [EncryptionService],
        })
          .overrideTemplate(EncryptionComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(EncryptionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EncryptionService);
    });

    describe('encrypt', () => {
      it('should encrypt text', () => {
        const encryptedText = '{cipher}8664f5cf85bf4350946a10516c0596e3b03fc28ef32589b7c928d3fbb3b48a532531cfb9c430b0411bc72c4894dca2cd';
        comp.textToEncrypt = 'my-text-to-encrypt';
        jest.spyOn(service, 'encrypt').mockReturnValue(of(encryptedText));

        comp.encrypt();

        expect(service.encrypt).toHaveBeenCalled();
        expect(comp.encryptedText).toEqual(encryptedText);
        expect(comp.result).toEqual(encryptedText);
      });

      it('should not encrypt text on error', () => {
        comp.textToEncrypt = 'my-text-to-encrypt';
        jest.spyOn(service, 'encrypt').mockReturnValue(throwError('service unavailable'));

        comp.encrypt();

        expect(service.encrypt).toHaveBeenCalled();
        expect(comp.encryptedText).toEqual('');
        expect(comp.result).toEqual('');
      });
    });

    describe('decrypt', () => {
      it('should decrypt text', () => {
        const decryptedText = 'my-text-to-encrypt';
        comp.encryptedText = '{cipher}8664f5cf85bf4350946a10516c0596e3b03fc28ef32589b7c928d3fbb3b48a532531cfb9c430b0411bc72c4894dca2cd';
        jest.spyOn(service, 'decrypt').mockReturnValue(of(decryptedText));

        comp.decrypt();

        expect(service.decrypt).toHaveBeenCalled();
        expect(comp.textToEncrypt).toEqual(decryptedText);
        expect(comp.result).toEqual(decryptedText);
      });

      it('should not decrypt text on error', () => {
        comp.encryptedText = '{cipher}8664f5cf85bf4350946a10516c0596e3b03fc28ef32589b7c928d3fbb3b48a532531cfb9c430b0411bc72c4894dca2cd';
        jest.spyOn(service, 'decrypt').mockReturnValue(throwError('service unavailable'));

        comp.decrypt();

        expect(service.decrypt).toHaveBeenCalled();
        expect(comp.textToEncrypt).toEqual('');
        expect(comp.result).toEqual('');
      });
    });
  });
});
